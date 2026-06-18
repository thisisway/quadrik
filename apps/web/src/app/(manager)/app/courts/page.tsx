'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Court {
  id: string
  name: string
  sport: string
  surface: string
  capacity: number
  pricePerHour: number
  isActive: boolean
  description: string | null
}

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

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  sport: z.string().min(1, 'Esporte obrigatório'),
  surface: z.string().min(1, 'Superfície obrigatória'),
  capacity: z.coerce.number().int().min(1).max(20),
  pricePerHour: z.coerce.number().min(0),
  description: z.string().optional(),
})
type FormData = z.infer<typeof schema>

function CourtCard({ court, onToggle }: { court: Court; onToggle: (id: string, active: boolean) => void }) {
  return (
    <div className={cn('rounded-2xl bg-white p-5 shadow-sm transition-opacity', !court.isActive && 'opacity-60')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-q-navy truncate">{court.name}</h3>
            <Badge variant={court.isActive ? 'success' : 'default'}>
              {court.isActive ? 'Ativa' : 'Inativa'}
            </Badge>
          </div>
          <p className="mt-0.5 text-sm text-gray">
            {sportLabels[court.sport] ?? court.sport} · {surfaceLabels[court.surface] ?? court.surface}
          </p>
        </div>
        <button
          onClick={() => onToggle(court.id, !court.isActive)}
          className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium border border-gray-200 text-gray hover:border-q-navy/30 hover:text-q-navy transition-colors"
        >
          {court.isActive ? 'Desativar' : 'Ativar'}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-sand p-3">
          <p className="text-xs text-gray">Capacidade</p>
          <p className="mt-0.5 font-semibold text-q-navy">{court.capacity} pessoas</p>
        </div>
        <div className="rounded-xl bg-sand p-3">
          <p className="text-xs text-gray">Valor/hora</p>
          <p className="mt-0.5 font-semibold text-q-navy">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(court.pricePerHour)}
          </p>
        </div>
      </div>

      {court.description && (
        <p className="mt-3 text-xs text-gray line-clamp-2">{court.description}</p>
      )}
    </div>
  )
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
    },
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`/clubs/${clubId}/courts/${id}`, { isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courts', clubId] }),
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
              onToggle={(id, isActive) => toggleMutation.mutate({ id, isActive })}
            />
          ))}
        </div>
      )}
    </div>
  )
}
