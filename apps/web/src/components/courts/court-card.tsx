'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface Court {
  id: string
  name: string
  sportType: string
  surfaceType: string | null
  playerCapacity: number
  pricePerHour: number | string
  status: string
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
  name: z.string().min(2),
  sportType: z.string().min(1),
  surfaceType: z.string().optional(),
  playerCapacity: z.coerce.number().int().min(1).max(20),
  pricePerHour: z.coerce.number().min(0),
})
type FormData = z.infer<typeof schema>

interface Props {
  court: Court
  clubId: string
}

export function CourtCard({ court, clubId }: Props) {
  const [editing, setEditing] = useState(false)
  const qc = useQueryClient()
  const isActive = court.status === 'active'

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: court.name,
      sportType: court.sportType,
      surfaceType: court.surfaceType ?? '',
      playerCapacity: court.playerCapacity,
      pricePerHour: Number(court.pricePerHour),
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => api.patch(`/clubs/${clubId}/courts/${court.id}`, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['courts', clubId] })
      setEditing(false)
      toast('Quadra atualizada!', { variant: 'success' })
    },
    onError: (err) => toast((err as { message?: string }).message ?? 'Erro ao salvar', { variant: 'error' }),
  })

  const toggleMutation = useMutation({
    mutationFn: (status: string) => api.patch(`/clubs/${clubId}/courts/${court.id}`, { status }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['courts', clubId] })
      toast(isActive ? 'Quadra desativada' : 'Quadra ativada!', {
        variant: isActive ? 'default' : 'success',
      })
    },
  })

  if (editing) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-2 ring-q-blue/30">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-q-navy">Editar quadra</h3>
          <button onClick={() => setEditing(false)} className="text-xs text-gray hover:text-q-navy">
            Cancelar
          </button>
        </div>
        <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor={`name-${court.id}`}>Nome</Label>
            <Input id={`name-${court.id}`} error={errors.name?.message} {...register('name')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Esporte</Label>
              <select className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-q-navy focus:outline-none focus:ring-2 focus:ring-q-blue" {...register('sportType')}>
                {Object.entries(sportLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Superfície</Label>
              <select className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-q-navy focus:outline-none focus:ring-2 focus:ring-q-blue" {...register('surfaceType')}>
                <option value="">—</option>
                {Object.entries(surfaceLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Capacidade</Label>
              <Input type="number" min={1} max={20} {...register('playerCapacity')} />
            </div>
            <div className="space-y-1">
              <Label>Valor/hora (R$)</Label>
              <Input type="number" min={0} step={0.01} {...register('pricePerHour')} />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="gradient" size="sm" className="flex-1" loading={isSubmitting || updateMutation.isPending}>
              Salvar
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className={cn('rounded-2xl bg-white p-5 shadow-sm transition-opacity', !isActive && 'opacity-60')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-q-navy">{court.name}</h3>
            <Badge variant={isActive ? 'success' : 'default'}>
              {isActive ? 'Ativa' : 'Inativa'}
            </Badge>
          </div>
          <p className="mt-0.5 text-sm text-gray">
            {sportLabels[court.sportType] ?? court.sportType}
            {court.surfaceType ? ` · ${surfaceLabels[court.surfaceType] ?? court.surfaceType}` : ''}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg p-1.5 text-gray hover:bg-sand hover:text-q-navy transition-colors"
            title="Editar"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => toggleMutation.mutate(isActive ? 'inactive' : 'active')}
            className={cn(
              'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
              isActive
                ? 'border border-gray-200 text-gray hover:border-q-red/30 hover:text-q-red'
                : 'border border-gray-200 text-gray hover:border-green-300 hover:text-green-600',
            )}
          >
            {isActive ? 'Desativar' : 'Ativar'}
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-sand p-3">
          <p className="text-xs text-gray">Capacidade</p>
          <p className="mt-0.5 font-semibold text-q-navy">{court.playerCapacity} pessoas</p>
        </div>
        <div className="rounded-xl bg-sand p-3">
          <p className="text-xs text-gray">Valor/hora</p>
          <p className="mt-0.5 font-semibold text-q-navy">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(court.pricePerHour))}
          </p>
        </div>
      </div>
    </div>
  )
}
