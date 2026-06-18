'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Booking {
  id: string
  startTime: string
  endTime: string
  status: string
  totalPrice: number
  notes: string | null
  court: { id: string; name: string; sport: string }
  participants: Array<{ user: { id: string; name: string } }>
}

interface Props {
  booking: Booking | null
  clubId: string
  onClose: () => void
}

const statusLabel: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Concluída',
  no_show: 'Falta',
}
const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'danger',
  completed: 'info',
  no_show: 'default',
}

const SPORTS_PT: Record<string, string> = {
  beach_tennis: 'Beach Tennis',
  volleyball: 'Vôlei de Praia',
  padel: 'Padel',
  tennis: 'Tênis',
  beach_soccer: 'Futevôlei',
}

function fmt(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Date(iso).toLocaleString('pt-BR', opts)
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-b-0">
      <span className="text-xs font-medium uppercase tracking-wide text-gray shrink-0">{label}</span>
      <span className="text-sm text-q-navy text-right">{children}</span>
    </div>
  )
}

export function BookingDetailPanel({ booking, clubId, onClose }: Props) {
  const qc = useQueryClient()

  const cancelMutation = useMutation({
    mutationFn: () => api.patch(`/clubs/${clubId}/bookings/${booking!.id}/cancel`, {}),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['bookings', clubId] })
      toast('Reserva cancelada', { variant: 'success' })
      onClose()
    },
    onError: (err) => toast((err as { message?: string }).message ?? 'Erro ao cancelar', { variant: 'error' }),
  })

  const confirmMutation = useMutation({
    mutationFn: () =>
      api.patch(`/clubs/${clubId}/bookings/${booking!.id}/status`, { status: 'confirmed' }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['bookings', clubId] })
      toast('Reserva confirmada!', { variant: 'success' })
      onClose()
    },
    onError: (err) => toast((err as { message?: string }).message ?? 'Erro ao confirmar', { variant: 'error' }),
  })

  const completeMutation = useMutation({
    mutationFn: () =>
      api.patch(`/clubs/${clubId}/bookings/${booking!.id}/status`, { status: 'completed' }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['bookings', clubId] })
      toast('Reserva marcada como concluída', { variant: 'success' })
      onClose()
    },
  })

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/30 transition-opacity duration-200',
          booking ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-xl transition-transform duration-200',
          booking ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-q-navy">Detalhes da reserva</h2>
            {booking && (
              <Badge variant={statusVariant[booking.status] ?? 'default'}>
                {statusLabel[booking.status] ?? booking.status}
              </Badge>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray hover:bg-sand hover:text-q-navy transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {booking && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {/* Court pill */}
              <div className="mb-5 flex items-center gap-2 rounded-xl bg-sand px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-q-navy/10">
                  <svg className="h-4 w-4 text-q-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-q-navy">{booking.court.name}</p>
                  <p className="text-xs text-gray">{SPORTS_PT[booking.court.sport] ?? booking.court.sport}</p>
                </div>
              </div>

              {/* Details */}
              <div className="rounded-xl border border-gray-100 px-4">
                <Row label="Data">
                  {fmt(booking.startTime, { weekday: 'long', day: '2-digit', month: 'long' })}
                </Row>
                <Row label="Horário">
                  {fmt(booking.startTime, { hour: '2-digit', minute: '2-digit' })}
                  {' – '}
                  {fmt(booking.endTime, { hour: '2-digit', minute: '2-digit' })}
                </Row>
                <Row label="Valor">
                  <span className="font-semibold">{formatCurrency(booking.totalPrice)}</span>
                </Row>
                <Row label="Jogadores">
                  <span className="text-right">
                    {booking.participants.length === 0
                      ? '—'
                      : booking.participants.map((p) => p.user.name).join(', ')}
                  </span>
                </Row>
                {booking.notes && (
                  <Row label="Obs.">{booking.notes}</Row>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-100 p-5 space-y-2">
              {booking.status === 'pending' && (
                <Button
                  variant="gradient"
                  className="w-full"
                  loading={confirmMutation.isPending}
                  onClick={() => confirmMutation.mutate()}
                >
                  Confirmar reserva
                </Button>
              )}
              {booking.status === 'confirmed' && (
                <Button
                  variant="primary"
                  className="w-full"
                  loading={completeMutation.isPending}
                  onClick={() => completeMutation.mutate()}
                >
                  Marcar como concluída
                </Button>
              )}
              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                <Button
                  variant="outline"
                  className="w-full text-q-red border-q-red/20 hover:bg-q-red/5"
                  loading={cancelMutation.isPending}
                  onClick={() => cancelMutation.mutate()}
                >
                  Cancelar reserva
                </Button>
              )}
              {booking.status === 'cancelled' && (
                <p className="text-center text-sm text-gray">Esta reserva foi cancelada.</p>
              )}
              {booking.status === 'completed' && (
                <p className="text-center text-sm text-gray">Reserva concluída.</p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
