'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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

interface Club {
  id: string
  name: string
  slug: string
  description: string | null
  phone: string | null
  email: string | null
  whatsapp: string | null
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  sportTypes: string[]
  isPublic: boolean
  _count: { courts: number; members: number }
}

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  sportTypes: z.array(z.string()),
  isPublic: z.boolean(),
})
type FormData = z.infer<typeof schema>

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 font-semibold text-q-navy">{title}</h2>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const { user } = useAuth()
  const clubId = user?.clubId ?? ''
  const qc = useQueryClient()
  const [saved, setSaved] = useState(false)

  const { data: club, isLoading } = useQuery<Club>({
    queryKey: ['club', clubId],
    queryFn: () => api.get<Club>(`/clubs/${clubId}`),
    enabled: !!clubId,
  })

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  // Populate form when club data loads
  useEffect(() => {
    if (club) {
      reset({
        name: club.name,
        description: club.description ?? '',
        phone: club.phone ?? '',
        email: club.email ?? '',
        whatsapp: club.whatsapp ?? '',
        address: club.address ?? '',
        city: club.city ?? '',
        state: club.state ?? '',
        zipCode: club.zipCode ?? '',
        sportTypes: club.sportTypes ?? [],
        isPublic: club.isPublic ?? false,
      })
    }
  }, [club, reset])

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.patch(`/clubs/${clubId}`, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['club', clubId] })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  if (!clubId) return null

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        {[1, 2, 3].map((i) => <div key={i} className="h-48 animate-pulse rounded-2xl bg-white" />)}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-q-navy">Configurações</h1>
        <p className="mt-1 text-sm text-gray">Gerencie as informações da sua arena</p>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
        {/* Basic info */}
        <Section title="Informações básicas">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome da arena</Label>
              <Input id="name" error={errors.name?.message} {...register('name')} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Descrição</Label>
              <textarea
                id="description"
                rows={3}
                className="flex w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-q-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-q-blue focus:border-transparent transition-colors"
                {...register('description')}
              />
            </div>

            <div className="space-y-2">
              <Label>Esportes</Label>
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
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
              <Controller
                name="isPublic"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={field.value}
                    onClick={() => field.onChange(!field.value)}
                    className={cn(
                      'relative h-6 w-10 rounded-full transition-colors',
                      field.value ? 'bg-q-blue' : 'bg-gray-200',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform',
                        field.value ? 'translate-x-5' : 'translate-x-1',
                      )}
                    />
                  </button>
                )}
              />
              <div>
                <p className="text-sm font-medium text-q-navy">Arena pública</p>
                <p className="text-xs text-gray">Aparecer nas buscas e permitir reservas pelos jogadores</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Contact */}
        <Section title="Contato">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" placeholder="(27) 99999-9999" {...register('phone')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input id="whatsapp" placeholder="(27) 99999-9999" {...register('whatsapp')} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contato@suaarena.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
          </div>
        </Section>

        {/* Address */}
        <Section title="Endereço">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Input id="address" placeholder="Rua, número, bairro" {...register('address')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" placeholder="Vitória" {...register('city')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state">Estado</Label>
              <Input id="state" placeholder="ES" maxLength={2} {...register('state')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="zipCode">CEP</Label>
              <Input id="zipCode" placeholder="29000-000" {...register('zipCode')} />
            </div>
          </div>
        </Section>

        {/* Stats (read-only) */}
        <Section title="Estatísticas">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-sand p-4">
              <p className="text-xs text-gray">Quadras</p>
              <p className="mt-1 text-2xl font-bold text-q-navy">{club?._count.courts ?? 0}</p>
            </div>
            <div className="rounded-xl bg-sand p-4">
              <p className="text-xs text-gray">Membros</p>
              <p className="mt-1 text-2xl font-bold text-q-navy">{club?._count.members ?? 0}</p>
            </div>
          </div>
        </Section>

        {mutation.error && (
          <div className="rounded-md border border-q-red/20 bg-q-red/5 px-4 py-3 text-sm text-q-red">
            {(mutation.error as { message?: string }).message ?? 'Erro ao salvar'}
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-sm font-medium text-green-600">Salvo com sucesso!</span>
          )}
          <Button
            type="submit"
            variant="gradient"
            loading={isSubmitting || mutation.isPending}
            disabled={!isDirty}
          >
            Salvar alterações
          </Button>
        </div>
      </form>
    </div>
  )
}
