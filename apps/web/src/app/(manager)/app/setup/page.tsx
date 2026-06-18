'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/contexts/auth'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const SPORTS = [
  { value: 'beach_tennis', label: 'Beach Tennis' },
  { value: 'volleyball', label: 'Vôlei de Praia' },
  { value: 'padel', label: 'Padel' },
  { value: 'tennis', label: 'Tênis' },
  { value: 'beach_soccer', label: 'Futevôlei' },
]

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)
}

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  slug: z
    .string()
    .min(2, 'Slug obrigatório')
    .regex(/^[a-z0-9-]+$/, 'Apenas letras minúsculas, números e hífen'),
  description: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  sportTypes: z.array(z.string()).min(1, 'Selecione pelo menos um esporte'),
})
type FormData = z.infer<typeof schema>

interface Club {
  id: string
  name: string
}

export default function SetupPage() {
  const { user, updateClub } = useAuth()
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  // If user already has a club, redirect to dashboard
  useEffect(() => {
    if (user?.clubId) router.replace('/app')
  }, [user, router])

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { sportTypes: [] },
  })

  const nameValue = watch('name')

  // Auto-generate slug from name
  useEffect(() => {
    if (nameValue) setValue('slug', toSlug(nameValue))
  }, [nameValue, setValue])

  async function onSubmit(data: FormData) {
    setServerError(null)
    try {
      const club = await api.post<Club>('/clubs', data)
      updateClub(club.id, 'OWNER')
      router.push('/app')
    } catch (err) {
      setServerError((err as { message?: string }).message ?? 'Erro ao criar arena')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[20px] bg-grad-sun shadow-md">
            <div className="h-8 w-8 rounded-full border-[5px] border-white" />
          </div>
          <h1 className="text-2xl font-bold text-q-navy">Crie sua arena</h1>
          <p className="mt-2 text-sm text-gray">
            Configure as informações básicas para começar a gerenciar suas quadras e reservas.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-7 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Nome */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome da arena</Label>
              <Input
                id="name"
                placeholder="Ex: Arena Beach Vitória"
                error={errors.name?.message}
                {...register('name')}
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <Label htmlFor="slug">
                URL da arena{' '}
                <span className="font-normal text-gray">(identificador único)</span>
              </Label>
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-sm text-gray">quadrik.app/</span>
                <Input
                  id="slug"
                  placeholder="arena-beach-vitoria"
                  error={errors.slug?.message}
                  {...register('slug')}
                />
              </div>
            </div>

            {/* Esportes */}
            <div className="space-y-2">
              <Label>Esportes oferecidos</Label>
              <Controller
                name="sportTypes"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {SPORTS.map((sport) => {
                      const active = field.value.includes(sport.value)
                      return (
                        <button
                          key={sport.value}
                          type="button"
                          onClick={() => {
                            const next = active
                              ? field.value.filter((v) => v !== sport.value)
                              : [...field.value, sport.value]
                            field.onChange(next)
                          }}
                          className={cn(
                            'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
                            active
                              ? 'bg-q-navy text-white'
                              : 'border border-gray-200 text-gray hover:border-q-navy/30 hover:text-q-navy',
                          )}
                        >
                          {sport.label}
                        </button>
                      )
                    })}
                  </div>
                )}
              />
              {errors.sportTypes && (
                <p className="text-xs text-q-red">{errors.sportTypes.message}</p>
              )}
            </div>

            {/* Cidade e Estado */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" placeholder="Ex: Vitória" {...register('city')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="state">Estado</Label>
                <Input id="state" placeholder="Ex: ES" maxLength={2} {...register('state')} />
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-1.5">
              <Label htmlFor="description">
                Descrição <span className="font-normal text-gray">(opcional)</span>
              </Label>
              <textarea
                id="description"
                rows={3}
                placeholder="Fale um pouco sobre sua arena..."
                className="flex w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-q-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-q-blue focus:border-transparent transition-colors"
                {...register('description')}
              />
            </div>

            {serverError && (
              <div className="rounded-md border border-q-red/20 bg-q-red/5 px-4 py-3 text-sm text-q-red">
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              loading={isSubmitting}
              className="w-full"
            >
              Criar arena e começar
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
