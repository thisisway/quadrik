'use client'

import { useState, useMemo } from 'react'
import { useAuth } from '@/contexts/auth'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Badge } from '@/components/ui/badge'

interface Booking {
  id: string
  startTime: string
  endTime: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  price: number | string
  court: { id: string; name: string; sportType: string }
  participants: Array<{ user: { id: string; name: string } }>
}

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

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

function brl(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function monthStart(year: number, month: number) {
  return isoDate(new Date(year, month, 1))
}

function monthEnd(year: number, month: number) {
  return isoDate(new Date(year, month + 1, 1))
}

export default function FinancesPage() {
  const { user } = useAuth()
  const clubId = user?.clubId

  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const startDate = monthStart(year, month)
  const endDate = monthEnd(year, month)

  const prevYear = month === 0 ? year - 1 : year
  const prevMonth = month === 0 ? 11 : month - 1
  const prevStart = monthStart(prevYear, prevMonth)
  const prevEnd = startDate

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['finances', clubId, startDate, endDate],
    queryFn: () =>
      api.get<Booking[]>(`/clubs/${clubId}/bookings?startDate=${startDate}&endDate=${endDate}`),
    enabled: !!clubId,
  })

  const { data: prevBookings = [] } = useQuery<Booking[]>({
    queryKey: ['finances', clubId, prevStart, prevEnd],
    queryFn: () =>
      api.get<Booking[]>(`/clubs/${clubId}/bookings?startDate=${prevStart}&endDate=${prevEnd}`),
    enabled: !!clubId,
  })

  const metrics = useMemo(() => {
    const active = bookings.filter((b) => ['confirmed', 'completed'].includes(b.status))
    const pending = bookings.filter((b) => b.status === 'pending')
    const cancelled = bookings.filter((b) => b.status === 'cancelled')

    const confirmedRevenue = active.reduce((s, b) => s + Number(b.price), 0)
    const pendingRevenue = pending.reduce((s, b) => s + Number(b.price), 0)

    const prevActive = prevBookings.filter((b) => ['confirmed', 'completed'].includes(b.status))
    const prevRevenue = prevActive.reduce((s, b) => s + Number(b.price), 0)
    const growth =
      prevRevenue > 0 ? ((confirmedRevenue - prevRevenue) / prevRevenue) * 100 : null

    return {
      confirmedRevenue,
      pendingRevenue,
      growth,
      confirmedCount: active.length,
      pendingCount: pending.length,
      cancelledCount: cancelled.length,
      totalCount: bookings.length,
    }
  }, [bookings, prevBookings])

  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const dailyData = useMemo(() => {
    const map: Record<number, number> = {}
    bookings
      .filter((b) => ['confirmed', 'completed'].includes(b.status))
      .forEach((b) => {
        const day = new Date(b.startTime).getDate()
        map[day] = (map[day] ?? 0) + Number(b.price)
      })
    return Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      receita: map[i + 1] ?? 0,
    }))
  }, [bookings, daysInMonth])

  const courtData = useMemo(() => {
    const map: Record<string, { name: string; receita: number; reservas: number }> = {}
    bookings
      .filter((b) => ['confirmed', 'completed'].includes(b.status))
      .forEach((b) => {
        const key = b.court.id
        if (!map[key]) map[key] = { name: b.court.name, receita: 0, reservas: 0 }
        map[key]!.receita += Number(b.price)
        map[key]!.reservas += 1
      })
    return Object.values(map).sort((a, b) => b.receita - a.receita)
  }, [bookings])

  const recentBookings = useMemo(
    () =>
      [...bookings]
        .filter((b) => b.status !== 'cancelled')
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
        .slice(0, 10),
    [bookings],
  )

  function prevNav() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1) } else setMonth((m) => m - 1)
  }
  function nextNav() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1) } else setMonth((m) => m + 1)
  }

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-q-navy">Financeiro</h1>
          <p className="mt-1 text-sm text-gray">Receitas e movimentações da arena</p>
        </div>
        {/* Month navigator */}
        <div className="flex items-center gap-2 self-start rounded-xl bg-white px-3 py-2 shadow-sm">
          <button
            onClick={prevNav}
            className="rounded p-1.5 text-gray hover:bg-gray-100 hover:text-q-navy transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="min-w-[148px] text-center text-sm font-semibold text-q-navy">
            {MONTHS_PT[month]} {year}
          </span>
          <button
            onClick={nextNav}
            disabled={isCurrentMonth}
            className="rounded p-1.5 text-gray hover:bg-gray-100 hover:text-q-navy transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-gray uppercase tracking-wide">Receita confirmada</p>
          <p className="mt-2 text-2xl font-black text-q-navy">
            {isLoading ? '—' : brl(metrics.confirmedRevenue)}
          </p>
          {metrics.growth !== null && (
            <p className={`mt-1 text-xs font-medium ${metrics.growth >= 0 ? 'text-green-600' : 'text-q-red'}`}>
              {metrics.growth >= 0 ? '▲' : '▼'} {Math.abs(metrics.growth).toFixed(1)}% vs mês anterior
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-gray uppercase tracking-wide">Aguardando</p>
          <p className="mt-2 text-2xl font-black text-q-yellow">
            {isLoading ? '—' : brl(metrics.pendingRevenue)}
          </p>
          <p className="mt-1 text-xs text-gray">{metrics.pendingCount} reservas pendentes</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-gray uppercase tracking-wide">Reservas</p>
          <p className="mt-2 text-2xl font-black text-q-navy">
            {isLoading ? '—' : metrics.confirmedCount}
          </p>
          <p className="mt-1 text-xs text-gray">confirmadas / concluídas</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-gray uppercase tracking-wide">Cancelamentos</p>
          <p className="mt-2 text-2xl font-black text-q-red">
            {isLoading ? '—' : metrics.cancelledCount}
          </p>
          <p className="mt-1 text-xs text-gray">de {metrics.totalCount} reservas no total</p>
        </div>
      </div>

      {/* Daily revenue chart */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 font-semibold text-q-navy">
          Receita por dia — {MONTHS_PT[month]}
        </h2>
        {isLoading ? (
          <div className="h-48 animate-pulse rounded-xl bg-gray-100" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData} barSize={14} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                interval={Math.ceil(daysInMonth / 10) - 1}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `R$${(v as number / 1000).toFixed(0)}k`}
                width={44}
              />
              <Tooltip
                formatter={(value) => [brl(value as number), 'Receita']}
                labelFormatter={(label) => `Dia ${label as string}`}
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px #00000015' }}
              />
              <Bar dataKey="receita" fill="#EF3E3E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Court breakdown + recent table */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* By court */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 font-semibold text-q-navy">Receita por quadra</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />)}
            </div>
          ) : courtData.length === 0 ? (
            <p className="text-sm text-gray">Sem receita confirmada neste período.</p>
          ) : (
            <div className="space-y-3">
              {courtData.map((c) => {
                const pct = metrics.confirmedRevenue > 0
                  ? (c.receita / metrics.confirmedRevenue) * 100
                  : 0
                return (
                  <div key={c.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-q-navy">{c.name}</span>
                      <span className="text-gray">{brl(c.receita)}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-grad-sun"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-0.5 text-[11px] text-gray">{c.reservas} reservas · {pct.toFixed(0)}% da receita</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Status breakdown */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 font-semibold text-q-navy">Resumo por status</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-9 animate-pulse rounded-lg bg-gray-100" />)}
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-sm text-gray">Sem reservas neste período.</p>
          ) : (
            <div className="space-y-2">
              {(['confirmed', 'completed', 'pending', 'cancelled', 'no_show'] as const).map((status) => {
                const group = bookings.filter((b) => b.status === status)
                if (group.length === 0) return null
                const total = group.reduce((s, b) => s + Number(b.price), 0)
                return (
                  <div key={status} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <Badge variant={STATUS_BADGE[status] ?? 'default'}>{STATUS_LABEL[status]}</Badge>
                      <span className="text-sm text-gray">{group.length} reservas</span>
                    </div>
                    <span className="text-sm font-semibold text-q-navy">{brl(total)}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent bookings table */}
      <div className="rounded-2xl bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="font-semibold text-q-navy">Últimas reservas do mês</h2>
        </div>
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />)}
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-gray">Sem reservas neste período.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray">Quadra</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray">Jogador</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3 text-q-navy">
                      {new Date(b.startTime).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                      })}
                      {' '}
                      <span className="text-gray">
                        {new Date(b.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-q-navy">{b.court.name}</td>
                    <td className="px-4 py-3 text-gray">
                      {b.participants[0]?.user.name ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_BADGE[b.status] ?? 'default'}>
                        {STATUS_LABEL[b.status] ?? b.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-right font-semibold text-q-navy">
                      {brl(Number(b.price))}
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
