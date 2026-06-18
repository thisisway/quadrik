'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CourtCard, type Court } from '@/components/courts/court-card'
import { cn } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  sport: z.string().min(1, 'Esporte obrigatório'),
  surface: z.string().min(1, 'Superfície obrigatória'),
  capacity: z.coerce.number().int().min(1).max(20),
  pricePerHour: z.coerce.number().min(0),
  description: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const sportLabels: Record<string, string> = {
  beach_tennis: 'Beach Tennis',
  volleyball: 'Vôlei de Praia',
  padel: 'Padel',
  tennis: 'Tênis',
  beach_soccer: 'Futevôlei',
}
const surfaceLabels: Record<string, string> = {
  sand: 'Areia',
  clay: 'Saibro',
  cement: 'Cimento',
  synthetic: 'Sintético',
  wood: 'Madeira',
}

export default function CourtsPage() {
  const { user } = useAuth()
  const clubId = user?.clubId
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)

  const { data: courts, isLoading } = useQuery<Court[]>({
    queryKey: ['courts', clubId],
    queryFn: () => api.get<Court[]>(`/clubs/${clubId}/courts`),
    enabled: !!clubId,
  })

  const createMutation = useMutation({
    mutationFn: (data: FormData) => api.post(`/clubs/${clubId}/courts`, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['courts', clubId] })
      setShowForm(false)
      reset()
      toast('Quadra criada com sucesso!', { variant: 'success' })
    },
    onError: (err) => toast((err as { message?: string }).message ?? 'Erro ao criar quadra', { variant: 'error' }),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { capacity: 4, pricePerHour: 60 } })

  if (!clubId) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white">
        <p className="text-sm text-gray">Nenhuma arena vinculada à sua conta.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-q-navy">Quadras</h1>
          <p className="mt-1 text-sm text-gray">{courts?.length ?? 0} quadras cadastradas</p>
        </div>
        <Button variant="gradient" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancelar' : '+ Nova quadra'}
        </Button>
      </div>

      {/* New court form */}
      {showForm && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 font-semibold text-q-navy">Nova quadra</h2>
          <form
            onSubmit={handleSubmit((data) => createMutation.mutate(data))}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome da quadra</Label>
              <Input id="name" placeholder="Ex: Quadra 1" error={errors.name?.message} {...register('name')} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sport">Esporte</Label>
              <select
                id="sport"
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-q-navy focus:outline-none focus:ring-2 focus:ring-q-blue"
                {...register('sport')}
              >
                <option value="">Selecione</option>
                {Object.entries(sportLabels).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              {errors.sport && <p className="text-xs text-q-red">{errors.sport.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="surface">Superfície</Label>
              <select
                id="surface"
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-q-navy focus:outline-none focus:ring-2 focus:ring-q-blue"
                {...register('surface')}
              >
                <option value="">Selecione</option>
                {Object.entries(surfaceLabels).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              {errors.surface && <p className="text-xs text-q-red">{errors.surface.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="capacity">Capacidade (pessoas)</Label>
              <Input id="capacity" type="number" min={1} max={20} error={errors.capacity?.message} {...register('capacity')} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pricePerHour">Valor por hora (R$)</Label>
              <Input id="pricePerHour" type="number" min={0} step={0.01} error={errors.pricePerHour?.message} {...register('pricePerHour')} />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Input id="description" placeholder="Ex: Quadra coberta com iluminação" {...register('description')} />
            </div>

            {createMutation.error && (
              <div className="sm:col-span-2 rounded-md border border-q-red/20 bg-q-red/5 px-4 py-3 text-sm text-q-red">
                {(createMutation.error as { message?: string }).message ?? 'Erro ao criar quadra'}
              </div>
            )}

            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" variant="gradient" loading={isSubmitting}>
                Salvar quadra
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Courts grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : courts?.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-white text-center">
          <p className="font-medium text-q-navy">Nenhuma quadra ainda</p>
          <p className="text-sm text-gray">Clique em &ldquo;+ Nova quadra&rdquo; para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courts?.map((court) => (
            <CourtCard
              key={court.id}
              court={court}
              clubId={clubId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
