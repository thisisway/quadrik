'use client'

import { useAuth } from '@/contexts/auth'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Badge } from '@/components/ui/badge'

interface Court {
  id: string
  name: string
  sport: string
  sportType: string
  surface: string
  capacity: number
  pricePerHour: number
  description: string | null
  status: string
}

const SPORTS_PT: Record<string, string> = {
  beach_tennis: 'Beach Tennis',
  volleyball: 'Vôlei de Praia',
  padel: 'Padel',
  tennis: 'Tênis',
  beach_soccer: 'Futevôlei',
}
const SURFACE_PT: Record<string, string> = {
  sand: 'Areia',
  clay: 'Saibro',
  cement: 'Cimento',
  synthetic: 'Sintético',
  wood: 'Madeira',
}

const SPORT_EMOJI: Record<string, string> = {
  beach_tennis: '🎾',
  volleyball: '🏐',
  padel: '🏓',
  tennis: '🎾',
  beach_soccer: '⚽',
}

const SPORT_GRADIENT: Record<string, string> = {
  beach_tennis: 'from-q-orange/20 to-q-yellow/10',
  volleyball: 'from-q-blue/15 to-q-navy/5',
  padel: 'from-green-100 to-emerald-50',
  tennis: 'from-q-red/15 to-q-orange/5',
  beach_soccer: 'from-q-yellow/20 to-amber-50',
}

function brl(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

export default function PlayerCourtsPage() {
  const { user } = useAuth()

  const { data: courts = [], isLoading } = useQuery<Court[]>({
    queryKey: ['courts', user?.clubId],
    queryFn: () => api.get<Court[]>(`/clubs/${user!.clubId}/courts`),
    enabled: !!user?.clubId,
  })

  const active = courts.filter((c) => c.status === 'active')

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-q-navy">Quadras disponíveis</h1>
        <p className="mt-0.5 text-sm text-gray">
          {active.length} quadra{active.length !== 1 ? 's' : ''} ativa{active.length !== 1 ? 's' : ''} na arena
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-36 animate-pulse rounded-2xl bg-white" />)}
        </div>
      ) : active.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white text-center">
          <p className="font-medium text-q-navy">Nenhuma quadra disponível</p>
          <p className="text-sm text-gray">Entre em contato com a arena para mais informações</p>
        </div>
      ) : (
        <div className="space-y-3">
          {active.map((court) => {
            const sport = court.sportType ?? court.sport
            const gradient = SPORT_GRADIENT[sport] ?? 'from-gray-100 to-gray-50'
            const emoji = SPORT_EMOJI[sport] ?? '🏟️'

            return (
              <div
                key={court.id}
                className={`overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} border border-white shadow-sm`}
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{emoji}</span>
                      <div>
                        <p className="font-bold text-q-navy">{court.name}</p>
                        <p className="text-sm text-gray">{SPORTS_PT[sport] ?? sport}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-q-navy">{brl(court.pricePerHour)}</p>
                      <p className="text-xs text-gray">por hora</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="default">
                      {SURFACE_PT[court.surface] ?? court.surface}
                    </Badge>
                    <Badge variant="default">
                      {court.capacity} pessoas
                    </Badge>
                  </div>

                  {court.description && (
                    <p className="mt-3 text-sm text-gray">{court.description}</p>
                  )}

                  <p className="mt-3 text-xs text-gray">
                    Para reservar, entre em contato com a recepção da arena.
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
