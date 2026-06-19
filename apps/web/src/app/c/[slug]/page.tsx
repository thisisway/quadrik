import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Court {
  id: string
  name: string
  sportType: string
  surfaceType: string | null
  playerCapacity: number
  pricePerHour: string
  status: string
}

interface Club {
  id: string
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  coverUrl: string | null
  phone: string | null
  email: string | null
  whatsapp: string | null
  address: string | null
  city: string | null
  state: string | null
  sportTypes: string[]
  courts: Court[]
  _count: { members: number }
}

const SPORTS_PT: Record<string, string> = {
  beach_tennis: 'Beach Tennis',
  volleyball: 'Vôlei de Praia',
  padel: 'Padel',
  tennis: 'Tênis',
}

const SPORT_EMOJI: Record<string, string> = {
  beach_tennis: '🎾',
  volleyball: '🏐',
  padel: '🏸',
  tennis: '🎾',
}

const LEVEL_PT: Record<string, string> = {
  sand: 'Areia',
  clay: 'Saibro',
  hard: 'Piso rígido',
  grass: 'Grama',
  synthetic: 'Sintético',
}

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value))
}

async function getClub(slug: string): Promise<Club | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/clubs/${slug}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json() as Promise<Club>
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const club = await getClub(slug)
  if (!club) return { title: 'Arena não encontrada | Quadrik' }
  return {
    title: `${club.name} | Quadrik`,
    description: club.description ?? `Reserve quadras em ${club.name}`,
    openGraph: {
      title: club.name,
      description: club.description ?? `Reserve quadras em ${club.name}`,
      images: club.coverUrl ? [club.coverUrl] : [],
    },
  }
}

export default async function PublicClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const club = await getClub(slug)
  if (!club) notFound()

  return (
    <div className="min-h-screen bg-[#FFF9EC]">
      {/* Cover + header */}
      <div className="relative">
        {club.coverUrl ? (
          <div className="h-48 w-full overflow-hidden sm:h-64">
            <img src={club.coverUrl} alt={club.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
          </div>
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-[#071B3A] to-[#0477BF] sm:h-64" />
        )}

        {/* Quadrik branding */}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#EF3E3E] to-[#F47A32] shadow">
            <div className="h-3 w-3 rounded-full border-[2.5px] border-white" />
          </div>
          <span className="text-sm font-black tracking-tight text-white drop-shadow">Quadrik</span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-16">
        {/* Club info card */}
        <div className="-mt-8 mb-6 rounded-2xl bg-white p-6 shadow-md sm:-mt-12">
          <div className="flex items-start gap-4">
            {club.logoUrl ? (
              <img
                src={club.logoUrl}
                alt={club.name}
                className="h-16 w-16 shrink-0 rounded-xl object-cover shadow sm:h-20 sm:w-20"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#EF3E3E] to-[#F47A32] shadow sm:h-20 sm:w-20">
                <span className="text-2xl font-black text-white">{club.name.charAt(0)}</span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-black text-[#071B3A] sm:text-3xl">{club.name}</h1>
              {(club.city ?? club.state) && (
                <p className="mt-0.5 text-sm text-gray-500">
                  {[club.city, club.state].filter(Boolean).join(', ')}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {club.sportTypes.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-[#071B3A]/8 px-2.5 py-0.5 text-xs font-semibold text-[#071B3A]"
                  >
                    {SPORT_EMOJI[s]} {SPORTS_PT[s] ?? s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {club.description && (
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">{club.description}</p>
          )}

          {/* Contact row */}
          {(club.phone ?? club.email ?? club.whatsapp) && (
            <div className="mt-4 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
              {club.whatsapp && (
                <a
                  href={`https://wa.me/${club.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.554 4.109 1.523 5.836L0 24l6.336-1.498A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.024-1.375l-.36-.214-3.733.882.933-3.648-.234-.373A9.818 9.818 0 0112 2.182c5.422 0 9.818 4.396 9.818 9.818 0 5.423-4.396 9.818-9.818 9.818z" />
                  </svg>
                  WhatsApp
                </a>
              )}
              {club.phone && (
                <a
                  href={`tel:${club.phone}`}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
                  </svg>
                  {club.phone}
                </a>
              )}
              {club.email && (
                <a
                  href={`mailto:${club.email}`}
                  className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {club.email}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Courts */}
        {club.courts.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-bold text-[#071B3A]">
              Quadras disponíveis ({club.courts.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {club.courts.map((court) => (
                <div key={court.id} className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-[#071B3A]">{court.name}</h3>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {SPORT_EMOJI[court.sportType]} {SPORTS_PT[court.sportType] ?? court.sportType}
                        {court.surfaceType ? ` · ${LEVEL_PT[court.surfaceType] ?? court.surfaceType}` : ''}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-lg font-black text-[#EF3E3E]">
                        {formatCurrency(court.pricePerHour)}
                      </p>
                      <p className="text-xs text-gray-400">/hora</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Até {court.playerCapacity} jogadores
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        {club.whatsapp && (
          <div className="mt-8 rounded-2xl bg-gradient-to-br from-[#071B3A] to-[#0477BF] p-6 text-center text-white shadow">
            <p className="text-lg font-bold">Quer reservar uma quadra?</p>
            <p className="mt-1 text-sm text-white/70">Entre em contato com {club.name} pelo WhatsApp</p>
            <a
              href={`https://wa.me/${club.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-bold text-white shadow hover:bg-green-600 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.554 4.109 1.523 5.836L0 24l6.336-1.498A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.024-1.375l-.36-.214-3.733.882.933-3.648-.234-.373A9.818 9.818 0 0112 2.182c5.422 0 9.818 4.396 9.818 9.818 0 5.423-4.396 9.818-9.818 9.818z" />
              </svg>
              Falar no WhatsApp
            </a>
          </div>
        )}

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-400">
          Powered by{' '}
          <span className="font-bold text-[#071B3A]">Quadrik</span> — gestão de arenas esportivas
        </p>
      </div>
    </div>
  )
}
