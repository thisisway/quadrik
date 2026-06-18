'use client'

import { useAuth } from '@/contexts/auth'
import { useQuery, useQueries } from '@tanstack/react-query'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
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

function isoDate(d: Date) {
  return d.toISOString().substring(0, 10)
}

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return isoDate(d)
  })
}

function StatCard({
  label,
  value,
  sub,
  gradient,
}: {
  label: string
  value: string | number
  sub?: string | undefined
  gradient?: string | undefined
}) {
  return (
    <div className={`rounded-2xl p-5 shadow-sm ${gradient ?? 'bg-white'}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${gradient ? 'text-white/70' : 'text-gray'}`}>
        {label}
      </p>
      <p className={`mt-2 text-3xl font-black ${gradient ? 'text-white' : 'text-q-navy'}`}>{value}</p>
      {sub && <p className={`mt-1 text-sm ${gradient ? 'text-white/60' : 'text-gray'}`}>{sub}</p>}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ value: number; name: string }>
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-md text-xs">
      <p className="font-semibold text-q-navy">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="mt-0.5 text-gray">
          {p.name === 'revenue' ? formatCurrency(p.value) : `${p.value} reservas`}
        </p>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const clubId = user?.clubId
  const firstName = user?.name?.split(' ')[0] ?? 'aí'
  const today = isoDate(new Date())
  const last7 = getLast7Days()

  const { data: club } = useQuery<Club>({
    queryKey: ['club', clubId],
    queryFn: () => api.get<Club>(`/clubs/${clubId}`),
    enabled: !!clubId,
  })

  const { data: todayBookings } = useQuery<Booking[]>({
    queryKey: ['bookings', clubId, today],
    queryFn: () => api.get<Booking[]>(`/clubs/${clubId}/bookings?date=${today}`),
    enabled: !!clubId,
  })

  // Fetch last 7 days for the chart
  const weekQueries = useQueries({
    queries: last7.map((date) => ({
      queryKey: ['bookings', clubId, date],
      queryFn: () => api.get<Booking[]>(`/clubs/${clubId}/bookings?date=${date}`),
      enabled: !!clubId,
    })),
  })

  const chartData = last7.map((date, i) => {
    const dayBookings = weekQueries[i]?.data ?? []
    const revenue = dayBookings
      .filter((b) => b.status === 'confirmed' || b.status === 'completed')
      .reduce((s, b) => s + b.totalPrice, 0)
    const label = new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
    })
    return { date: label, bookings: dayBookings.length, revenue }
  })

  const confirmed = todayBookings?.filter((b) => b.status === 'confirmed' || b.status === 'pending') ?? []
  const todayRevenue = todayBookings
    ?.filter((b) => b.status === 'confirmed')
    .reduce((s, b) => s + b.totalPrice, 0) ?? 0

  const weekTotal = weekQueries.reduce((s, q) => s + (q.data?.length ?? 0), 0)
  const weekRevenue = weekQueries.reduce(
    (s, q) =>
      s +
      (q.data
        ?.filter((b) => b.status === 'confirmed' || b.status === 'completed')
        .reduce((a, b) => a + b.totalPrice, 0) ?? 0),
    0,
  )

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-q-navy">Olá, {firstName} 👋</h1>
        <p className="mt-1 text-sm text-gray">
          {club?.name ?? 'Sua arena'} ·{' '}
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Reservas hoje"
          value={todayBookings?.length ?? '–'}
          sub={`${confirmed.length} ativas`}
          gradient="bg-grad-sea"
        />
        <StatCard label="Receita hoje" value={formatCurrency(todayRevenue)} sub="confirmadas" />
        <StatCard
          label="Semana"
          value={weekTotal}
          sub={`${formatCurrency(weekRevenue)} receita`}
        />
        <StatCard label="Quadras" value={club?._count.courts ?? '–'} sub={`${club?._count.members ?? 0} membros`} />
      </div>

      {/* Weekly chart */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-q-navy">Reservas — últimos 7 dias</h2>
          <span className="text-xs text-gray">{weekTotal} no total</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#707070' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#707070' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={20}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#FFF9EC' }} />
            <Bar dataKey="bookings" name="bookings" fill="#0477BF" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Today's bookings */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-q-navy">Reservas de hoje</h2>
          <a href="/app/bookings" className="text-sm font-medium text-q-blue hover:underline">
            Ver todas →
          </a>
        </div>

        {!clubId ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-10 text-center">
            <p className="text-sm font-medium text-q-navy">Nenhuma arena vinculada</p>
          </div>
        ) : todayBookings?.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-10 text-center">
            <p className="text-sm font-medium text-q-navy">Nenhuma reserva hoje</p>
            <p className="mt-1 text-xs text-gray">Os horários estão disponíveis.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Horário', 'Quadra', 'Jogador', 'Valor', 'Status'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {todayBookings?.slice(0, 8).map((b) => (
                  <tr key={b.id} className="hover:bg-sand/60 transition-colors">
                    <td className="px-5 py-3 font-medium text-q-navy tabular-nums whitespace-nowrap">
                      {new Date(b.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      {' – '}
                      {new Date(b.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-5 py-3 text-gray">{b.court.name}</td>
                    <td className="px-5 py-3 text-gray">{b.participants[0]?.user.name ?? '—'}</td>
                    <td className="px-5 py-3 font-medium text-q-navy">{formatCurrency(b.totalPrice)}</td>
                    <td className="px-5 py-3">
                      <Badge variant={statusVariant[b.status] ?? 'default'}>
                        {statusLabel[b.status] ?? b.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(todayBookings?.length ?? 0) > 8 && (
              <div className="border-t border-gray-100 px-5 py-3 text-center">
                <a href="/app/bookings" className="text-xs font-medium text-q-blue hover:underline">
                  Ver mais {(todayBookings?.length ?? 0) - 8} reservas →
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
