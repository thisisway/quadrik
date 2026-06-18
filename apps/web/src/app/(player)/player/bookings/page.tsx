'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

interface Booking {
  id: string
  startTime: string
  endTime: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  price: number
  notes: string | null
  court: { id: string; name: string; sportType: string }
  participants: Array<{ user: { id: string; name: string } }>
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
  no_show: 'No-show',
}
const STATUS_BADGE: Record<string, 'warning' | 'info' | 'success' | 'danger' | 'default'> = {
  pending: 'warning',
  confirmed: 'info',
  completed: 'success',
  cancelled: 'danger',
  no_show: 'default',
}
const SPORTS_PT: Record<string, string> = {
  beach_tennis: 'Beach Tennis',
  volleyball: 'Vôlei',
  padel: 'Padel',
  tennis: 'Tênis',
  beach_soccer: 'Futevôlei',
}

function brl(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

function formatRange(start: string, end: string) {
  const s = new Date(start)
  const e = new Date(end)
  const date = s.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })
  const startT = s.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const endT = e.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return { date, time: `${startT} – ${endT}` }
}

export default function PlayerBookingsPage() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['my-bookings', user?.clubId],
    queryFn: () => api.get<Booking[]>(`/clubs/${user!.clubId}/bookings/mine`),
    enabled: !!user?.clubId,
  })

  const cancelMutation = useMutation({
    mutationFn: (id: string) =>
      api.patch(`/clubs/${user!.clubId}/bookings/${id}/cancel`, {}),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['my-bookings'] })
      toast('Reserva cancelada.', { variant: 'success' })
    },
    onError: (err) => toast((err as { message?: string }).message ?? 'Erro ao cancelar', { variant: 'error' }),
  })

  const now = new Date()
  const upcoming = bookings.filter(
    (b) => new Date(b.startTime) >= now && !['cancelled', 'no_show'].includes(b.status),
  )
  const past = bookings.filter(
    (b) => new Date(b.startTime) < now || ['cancelled', 'completed', 'no_show'].includes(b.status),
  )

  const list = tab === 'upcoming' ? upcoming : past

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-q-navy">Minhas reservas</h1>
        <p className="mt-0.5 text-sm text-gray">
          Olá, {user?.name.split(' ')[0]}! Aqui estão suas reservas.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-white p-1 shadow-sm">
        {(['upcoming', 'past'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
              tab === t
                ? 'bg-q-navy text-white shadow-sm'
                : 'text-gray hover:text-q-navy'
            }`}
          >
            {t === 'upcoming' ? `Próximas (${upcoming.length})` : `Histórico (${past.length})`}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white text-center">
          <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="font-medium text-q-navy">
            {tab === 'upcoming' ? 'Nenhuma reserva próxima' : 'Sem reservas anteriores'}
          </p>
          {tab === 'upcoming' && (
            <p className="text-sm text-gray">Solicite uma reserva à recepção da arena</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((b) => {
            const { date, time } = formatRange(b.startTime, b.endTime)
            const canCancel = ['pending', 'confirmed'].includes(b.status) && new Date(b.startTime) > now

            return (
              <div key={b.id} className="rounded-2xl bg-white p-4 shadow-sm">
                {/* Court + badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-q-navy">{b.court.name}</p>
                    <p className="text-xs text-gray">{SPORTS_PT[b.court.sportType] ?? b.court.sportType}</p>
                  </div>
                  <Badge variant={STATUS_BADGE[b.status] ?? 'default'}>
                    {STATUS_LABEL[b.status] ?? b.status}
                  </Badge>
                </div>

                {/* Date/time + price */}
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-q-navy capitalize">{date}</p>
                    <p className="text-sm text-gray">{time}</p>
                  </div>
                  <p className="text-lg font-black text-q-navy">{brl(b.price)}</p>
                </div>

                {/* Notes */}
                {b.notes && (
                  <p className="mt-2 rounded-lg bg-sand px-3 py-2 text-xs text-gray">
                    {b.notes}
                  </p>
                )}

                {/* Players */}
                {b.participants.length > 1 && (
                  <p className="mt-2 text-xs text-gray">
                    Com: {b.participants.filter((p) => p.user.id !== user?.id).map((p) => p.user.name).join(', ')}
                  </p>
                )}

                {/* Cancel button */}
                {canCancel && (
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => cancelMutation.mutate(b.id)}
                      loading={cancelMutation.isPending}
                      className="text-q-red hover:bg-q-red/8"
                    >
                      Cancelar reserva
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
