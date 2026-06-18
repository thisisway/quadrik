'use client'

import { useAuth } from '@/contexts/auth'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface Club {
  id: string
  name: string
  _count: { courts: number; members: number }
}

interface Booking {
  id: string
  startTime: string
  endTime: string
  status: string
  totalPrice: number
  court: { name: string; sport: string }
  participants: Array<{ user: { name: string } }>
}

const statusLabel: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Concluída',
  no_show: 'Falta',
}

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'orange'> = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'danger',
  completed: 'info',
  no_show: 'default',
}

function StatCard({
  label,
  value,
  sub,
  gradient,
}: {
  label: string
  value: string | number
  sub?: string
  gradient?: string
}) {
  return (
    <div className={`rounded-2xl p-5 shadow-sm ${gradient ?? 'bg-white'}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${gradient ? 'text-white/70' : 'text-gray'}`}>
        {label}
      </p>
      <p className={`mt-2 text-3xl font-black ${gradient ? 'text-white' : 'text-q-navy'}`}>{value}</p>
      {sub && (
        <p className={`mt-1 text-sm ${gradient ? 'text-white/60' : 'text-gray'}`}>{sub}</p>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const clubId = user?.clubId

  const { data: club } = useQuery<Club>({
    queryKey: ['club', clubId],
    queryFn: () => api.get<Club>(`/clubs/${clubId}`),
    enabled: !!clubId,
  })

  const today = new Date().toISOString().substring(0, 10)
  const { data: todayBookings } = useQuery<Booking[]>({
    queryKey: ['bookings', clubId, 'today'],
    queryFn: () => api.get<Booking[]>(`/clubs/${clubId}/bookings?date=${today}`),
    enabled: !!clubId,
  })

  const confirmed = todayBookings?.filter((b) => b.status === 'confirmed' || b.status === 'pending') ?? []
  const revenue = todayBookings?.filter((b) => b.status === 'confirmed').reduce((s, b) => s + b.totalPrice, 0) ?? 0

  const firstName = user?.name?.split(' ')[0] ?? 'aí'

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-q-navy">
          Olá, {firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-gray">
          {club?.name ?? 'Sua arena'} · {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Reservas hoje"
          value={todayBookings?.length ?? '–'}
          sub={`${confirmed.length} ativas`}
          gradient="bg-grad-sea"
        />
        <StatCard
          label="Receita hoje"
          value={formatCurrency(revenue)}
          sub="confirmadas"
        />
        <StatCard
          label="Quadras"
          value={club?._count.courts ?? '–'}
        />
        <StatCard
          label="Membros"
          value={club?._count.members ?? '–'}
        />
      </div>

      {/* Today's bookings */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-q-navy">Reservas de hoje</h2>
          <a href="/app/bookings" className="text-sm font-medium text-q-blue hover:underline">
            Ver todas →
          </a>
        </div>

        {!clubId ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-10 text-center">
            <p className="text-sm font-medium text-q-navy">Nenhuma arena vinculada</p>
            <p className="mt-1 text-xs text-gray">
              Crie uma arena em Configurações para começar a gerenciar reservas.
            </p>
          </div>
        ) : todayBookings?.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-10 text-center">
            <p className="text-sm font-medium text-q-navy">Nenhuma reserva hoje</p>
            <p className="mt-1 text-xs text-gray">Aproveite para divulgar os horários disponíveis.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray">
                    Horário
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray">
                    Quadra
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray">
                    Jogador
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray">
                    Valor
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {todayBookings?.map((b) => (
                  <tr key={b.id} className="hover:bg-sand/60 transition-colors">
                    <td className="px-5 py-3 font-medium text-q-navy tabular-nums">
                      {new Date(b.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      {' – '}
                      {new Date(b.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-5 py-3 text-gray">{b.court.name}</td>
                    <td className="px-5 py-3 text-gray">
                      {b.participants[0]?.user.name ?? '—'}
                    </td>
                    <td className="px-5 py-3 font-medium text-q-navy">
                      {formatCurrency(b.totalPrice)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={statusVariant[b.status] ?? 'default'}>
                        {statusLabel[b.status] ?? b.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
