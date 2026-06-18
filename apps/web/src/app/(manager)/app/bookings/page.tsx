'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookingGrid } from '@/components/bookings/booking-grid'
import { NewBookingModal } from '@/components/bookings/new-booking-modal'
import { BookingDetailPanel } from '@/components/bookings/booking-detail-panel'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Court {
  id: string
  name: string
  sportType: string
  pricePerHour: number | string
}

interface Booking {
  id: string
  startTime: string
  endTime: string
  status: string
  paymentStatus: string
  price: number | string
  notes: string | null
  court: { id: string; name: string; sportType: string }
  participants: Array<{ user: { id: string; name: string } }>
}

const statusLabel: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Concluída',
  no_show: 'Falta',
}

const statusVariant: Record<
  string,
  'default' | 'success' | 'warning' | 'danger' | 'info' | 'orange'
> = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'danger',
  completed: 'info',
  no_show: 'default',
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function isoDate(d: Date) {
  return d.toISOString().substring(0, 10)
}

function padTime(h: number) {
  return `${String(h).padStart(2, '0')}:00`
}

type View = 'list' | 'grid'

export default function BookingsPage() {
  const { user } = useAuth()
  const clubId = user?.clubId ?? ''
  const qc = useQueryClient()

  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(isoDate(today))
  const [selectedCourtId, setSelectedCourtId] = useState('')
  const [view, setView] = useState<View>('grid')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalDefaults, setModalDefaults] = useState<{
    courtId: string
    startTime: string
  }>({ courtId: '', startTime: '' })
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const { data: courts } = useQuery<Court[]>({
    queryKey: ['courts', clubId],
    queryFn: () => api.get<Court[]>(`/clubs/${clubId}/courts`),
    enabled: !!clubId,
  })

  const params = new URLSearchParams({ date: selectedDate })
  if (selectedCourtId) params.set('courtId', selectedCourtId)

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ['bookings', clubId, selectedDate, selectedCourtId],
    queryFn: () => api.get<Booking[]>(`/clubs/${clubId}/bookings?${params.toString()}`),
    enabled: !!clubId,
  })

  const cancelMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/clubs/${clubId}/bookings/${id}/cancel`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings', clubId] }),
  })

  const confirmMutation = useMutation({
    mutationFn: (id: string) =>
      api.patch(`/clubs/${clubId}/bookings/${id}/status`, { status: 'confirmed' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings', clubId] }),
  })

  function openModal(courtId = '', hour = 0) {
    setModalDefaults({ courtId, startTime: hour ? padTime(hour) : '' })
    setModalOpen(true)
  }

  function shiftDay(delta: number) {
    const d = new Date(selectedDate + 'T12:00:00')
    d.setDate(d.getDate() + delta)
    setSelectedDate(isoDate(d))
  }

  if (!clubId) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white">
        <p className="text-sm text-gray">Nenhuma arena vinculada à sua conta.</p>
      </div>
    )
  }

  // Grid view always shows all courts (ignore court filter)
  const gridCourts = courts?.filter((c) => !selectedCourtId || c.id === selectedCourtId) ?? []

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-q-navy">Reservas</h1>
          <p className="mt-0.5 text-sm text-gray">
            {bookings?.length ?? 0} reservas em {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <Button variant="gradient" onClick={() => openModal()}>
          + Nova reserva
        </Button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
        {/* Day navigator */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => shiftDay(-1)}
            className="rounded-lg border border-gray-200 p-2 hover:bg-sand transition-colors"
          >
            <svg className="h-4 w-4 text-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-q-navy focus:outline-none focus:ring-2 focus:ring-q-blue"
          />
          <button
            onClick={() => shiftDay(1)}
            className="rounded-lg border border-gray-200 p-2 hover:bg-sand transition-colors"
          >
            <svg className="h-4 w-4 text-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={() => setSelectedDate(isoDate(today))}
            className={cn(
              'rounded-lg px-3 py-2 text-xs font-medium transition-colors',
              selectedDate === isoDate(today)
                ? 'bg-q-navy text-white'
                : 'border border-gray-200 text-gray hover:bg-sand',
            )}
          >
            Hoje
          </button>
        </div>

        {/* Court filter */}
        <select
          value={selectedCourtId}
          onChange={(e) => setSelectedCourtId(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-q-navy focus:outline-none focus:ring-2 focus:ring-q-blue"
        >
          <option value="">Todas as quadras</option>
          {courts?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* View toggle */}
        <div className="ml-auto flex items-center gap-1 rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setView('grid')}
            title="Agenda"
            className={cn(
              'rounded-md p-1.5 transition-colors',
              view === 'grid' ? 'bg-q-navy text-white' : 'text-gray hover:text-q-navy',
            )}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M14 3v18" />
            </svg>
          </button>
          <button
            onClick={() => setView('list')}
            title="Lista"
            className={cn(
              'rounded-md p-1.5 transition-colors',
              view === 'list' ? 'bg-q-navy text-white' : 'text-gray hover:text-q-navy',
            )}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Booking detail slide-over */}
      <BookingDetailPanel
        booking={selectedBooking}
        clubId={clubId}
        onClose={() => setSelectedBooking(null)}
      />

      {/* New booking modal */}
      <NewBookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        clubId={clubId}
        courts={courts ?? []}
        defaultDate={selectedDate}
        defaultCourtId={modalDefaults.courtId}
        defaultStartTime={modalDefaults.startTime}
      />

      {/* Content */}
      {isLoading ? (
        <div className="h-48 animate-pulse rounded-2xl bg-white" />
      ) : view === 'grid' ? (
        /* ── Grid view ── */
        gridCourts.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white">
            <p className="font-medium text-q-navy">Nenhuma quadra cadastrada</p>
            <a href="/app/courts" className="text-sm text-q-blue hover:underline">Cadastrar quadras →</a>
          </div>
        ) : (
          <BookingGrid
            courts={gridCourts}
            bookings={bookings ?? []}
            onSlotClick={(courtId, hour) => openModal(courtId, hour)}
            onBookingClick={(b) => setSelectedBooking(b)}
          />
        )
      ) : (
        /* ── List view ── */
        bookings?.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white">
            <p className="font-medium text-q-navy">Nenhuma reserva neste dia</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Horário', 'Quadra', 'Jogador', 'Valor', 'Status', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings?.map((b) => (
                  <tr key={b.id} className="hover:bg-sand/40 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-q-navy tabular-nums whitespace-nowrap">
                      {formatTime(b.startTime)} – {formatTime(b.endTime)}
                    </td>
                    <td className="px-5 py-3.5 text-gray">{b.court.name}</td>
                    <td className="px-5 py-3.5 text-gray">
                      {b.participants[0]?.user.name ?? '—'}
                      {b.participants.length > 1 && (
                        <span className="ml-1 text-xs text-gray/60">+{b.participants.length - 1}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-q-navy">{formatCurrency(Number(b.price))}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={statusVariant[b.status] ?? 'default'}>
                        {statusLabel[b.status] ?? b.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        {b.status === 'pending' && (
                          <button
                            onClick={() => confirmMutation.mutate(b.id)}
                            className="rounded px-2 py-1 text-xs font-medium text-q-blue hover:bg-q-blue/10 transition-colors"
                          >
                            Confirmar
                          </button>
                        )}
                        {(b.status === 'pending' || b.status === 'confirmed') && (
                          <button
                            onClick={() => cancelMutation.mutate(b.id)}
                            className="rounded px-2 py-1 text-xs font-medium text-q-red hover:bg-q-red/10 transition-colors"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  )
}
