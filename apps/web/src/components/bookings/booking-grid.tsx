'use client'

import { cn } from '@/lib/utils'

const START_HOUR = 6
const END_HOUR = 23
const TOTAL_HOURS = END_HOUR - START_HOUR
const HOUR_H = 64 // px per hour

interface Court {
  id: string
  name: string
  sport: string
  pricePerHour: number
}

interface Booking {
  id: string
  startTime: string
  endTime: string
  status: string
  totalPrice: number
  court: { id: string; name: string; sport: string }
  participants: Array<{ user: { id: string; name: string } }>
}

interface Props {
  courts: Court[]
  bookings: Booking[]
  onSlotClick: (courtId: string, hour: number) => void
  onBookingClick: (booking: Booking) => void
}

const statusStyle: Record<string, string> = {
  pending: 'bg-q-yellow/40 border-q-yellow/60 text-q-navy',
  confirmed: 'bg-q-blue/12 border-q-blue/40 text-q-blue',
  cancelled: 'bg-gray-100 border-gray-200 text-gray line-through opacity-50',
  completed: 'bg-green-50 border-green-300 text-green-700',
  no_show: 'bg-gray-50 border-gray-200 text-gray',
}

function toMinutes(iso: string) {
  const d = new Date(iso)
  return d.getHours() * 60 + d.getMinutes()
}

const SPORTS_PT: Record<string, string> = {
  beach_tennis: 'Beach Tennis',
  volleyball: 'Vôlei',
  padel: 'Padel',
  tennis: 'Tênis',
  beach_soccer: 'Futevôlei',
}

export function BookingGrid({ courts, bookings, onSlotClick, onBookingClick }: Props) {
  const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i)

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm select-none">
      <div style={{ minWidth: Math.max(560, courts.length * 160 + 64) }}>
        {/* Header */}
        <div className="flex border-b border-gray-100 bg-white">
          <div className="w-16 shrink-0 border-r border-gray-100" />
          {courts.map((court) => (
            <div
              key={court.id}
              className="flex-1 border-r border-gray-100 last:border-r-0 px-2 py-3 text-center"
            >
              <p className="text-xs font-semibold text-q-navy truncate">{court.name}</p>
              <p className="mt-0.5 text-[10px] text-gray">{SPORTS_PT[court.sport] ?? court.sport}</p>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex">
          {/* Time column */}
          <div className="w-16 shrink-0 border-r border-gray-100">
            {hours.map((h) => (
              <div
                key={h}
                style={{ height: HOUR_H }}
                className="relative border-b border-gray-50 last:border-b-0"
              >
                <span className="absolute right-2 top-1 text-[10px] text-gray tabular-nums">
                  {String(h).padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>

          {/* Court columns */}
          {courts.map((court) => {
            const courtBookings = bookings.filter((b) => b.court.id === court.id)
            return (
              <div
                key={court.id}
                className="relative flex-1 border-r border-gray-100 last:border-r-0"
                style={{ height: TOTAL_HOURS * HOUR_H }}
              >
                {/* Click zones per hour */}
                {hours.map((h) => (
                  <div
                    key={h}
                    className="absolute inset-x-0 hover:bg-q-blue/4 transition-colors cursor-pointer group"
                    style={{ top: (h - START_HOUR) * HOUR_H, height: HOUR_H }}
                    onClick={() => onSlotClick(court.id, h)}
                  >
                    {/* Hour line */}
                    <div className="absolute inset-x-0 top-0 border-t border-gray-100" />
                    {/* Half-hour line */}
                    <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-gray-100" />
                    {/* Add hint */}
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="rounded-full bg-q-blue/10 px-2 py-0.5 text-[10px] font-medium text-q-blue">
                        + reserva
                      </span>
                    </span>
                  </div>
                ))}

                {/* Booking blocks */}
                {courtBookings.map((booking) => {
                  const startMin = toMinutes(booking.startTime)
                  const endMin = toMinutes(booking.endTime)
                  const fromStart = startMin - START_HOUR * 60
                  const duration = endMin - startMin

                  const clampedStart = Math.max(0, fromStart)
                  const clampedDuration = Math.min(
                    duration - Math.max(0, -fromStart),
                    TOTAL_HOURS * 60 - clampedStart,
                  )
                  if (clampedDuration <= 0) return null

                  const top = (clampedStart / 60) * HOUR_H
                  const height = (clampedDuration / 60) * HOUR_H

                  return (
                    <button
                      key={booking.id}
                      className={cn(
                        'absolute inset-x-1 rounded-lg border px-2 py-1 text-left hover:opacity-80 active:opacity-70 transition-opacity overflow-hidden',
                        statusStyle[booking.status] ?? statusStyle.pending,
                      )}
                      style={{ top: top + 2, height: height - 4, zIndex: 2 }}
                      onClick={(e) => { e.stopPropagation(); onBookingClick(booking) }}
                    >
                      <p className="truncate text-[11px] font-semibold leading-tight">
                        {booking.participants[0]?.user.name ?? 'Reserva'}
                      </p>
                      {height > 36 && (
                        <p className="text-[10px] leading-tight opacity-70">
                          {new Date(booking.startTime).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {' – '}
                          {new Date(booking.endTime).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
