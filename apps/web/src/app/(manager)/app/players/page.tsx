'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'

interface Member {
  id: string
  role: string
  status: string
  joinedAt: string
  user: {
    id: string
    name: string
    email: string
    avatarUrl: string | null
  }
}

const ROLE_OPTIONS = [
  { value: 'MANAGER', label: 'Gerente' },
  { value: 'RECEPTIONIST', label: 'Recepcionista' },
  { value: 'FINANCE', label: 'Financeiro' },
  { value: 'TEACHER', label: 'Professor' },
  { value: 'ORGANIZER', label: 'Organizador' },
  { value: 'PLAYER', label: 'Jogador' },
]

const roleLabel: Record<string, string> = {
  OWNER: 'Proprietário',
  MANAGER: 'Gerente',
  RECEPTIONIST: 'Recepcionista',
  FINANCE: 'Financeiro',
  TEACHER: 'Professor',
  ORGANIZER: 'Organizador',
  PLAYER: 'Jogador',
}

const roleVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'orange'> = {
  OWNER: 'orange',
  MANAGER: 'info',
  RECEPTIONIST: 'default',
  FINANCE: 'success',
  TEACHER: 'warning',
  ORGANIZER: 'default',
  PLAYER: 'default',
}

const schema = z.object({
  email: z.string().email('Email inválido'),
  role: z.string().min(1, 'Selecione um papel'),
})
type FormData = z.infer<typeof schema>

function Avatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} className="h-10 w-10 rounded-full object-cover" />
  }
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-grad-sun text-sm font-bold text-white uppercase">
      {name.charAt(0)}
    </div>
  )
}

export default function PlayersPage() {
  const { user } = useAuth()
  const clubId = user?.clubId ?? ''
  const qc = useQueryClient()
  const [showInvite, setShowInvite] = useState(false)
  const [search, setSearch] = useState('')

  const { data: members, isLoading } = useQuery<Member[]>({
    queryKey: ['members', clubId],
    queryFn: () => api.get<Member[]>(`/clubs/${clubId}/members`),
    enabled: !!clubId,
  })

  const inviteMutation = useMutation({
    mutationFn: (data: FormData) =>
      api.post(`/clubs/${clubId}/members/invite`, { email: data.email, role: data.role }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['members', clubId] })
      setShowInvite(false)
      reset()
      toast('Membro convidado com sucesso!', { variant: 'success' })
    },
    onError: (err) => {
      toast((err as { message?: string }).message ?? 'Erro ao convidar', { variant: 'error' })
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { role: 'PLAYER' } })

  const filtered = members?.filter((m) => {
    if (!search) return true
    const q = search.toLowerCase()
    return m.user.name.toLowerCase().includes(q) || m.user.email.toLowerCase().includes(q)
  })

  const activeCount = members?.filter((m) => m.status === 'active').length ?? 0

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-q-navy">Membros</h1>
          <p className="mt-1 text-sm text-gray">{activeCount} membros ativos na arena</p>
        </div>
        <Button variant="gradient" onClick={() => setShowInvite((v) => !v)}>
          {showInvite ? 'Cancelar' : '+ Convidar membro'}
        </Button>
      </div>

      {/* Invite form */}
      {showInvite && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-q-navy">Convidar membro</h2>
          <form
            onSubmit={handleSubmit((d) => inviteMutation.mutate(d))}
            className="flex flex-col gap-4 sm:flex-row sm:items-end"
          >
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="email">Email do usuário</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@exemplo.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
            <div className="w-48 space-y-1.5">
              <Label htmlFor="role">Papel</Label>
              <select
                id="role"
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-q-navy focus:outline-none focus:ring-2 focus:ring-q-blue"
                {...register('role')}
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting || inviteMutation.isPending}
              className="sm:self-end"
            >
              Convidar
            </Button>
          </form>
          <p className="mt-3 text-xs text-gray">
            O usuário já deve ter uma conta no Quadrik para ser adicionado.
          </p>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-q-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-q-blue"
        />
      </div>

      {/* Members list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : filtered?.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white">
          <p className="font-medium text-q-navy">
            {search ? 'Nenhum membro encontrado' : 'Nenhum membro ainda'}
          </p>
          {!search && (
            <p className="text-sm text-gray">Convide membros usando o botão acima</p>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Membro', 'Papel', 'Status', 'Desde'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered?.map((m) => (
                <tr key={m.id} className="hover:bg-sand/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={m.user.name} avatarUrl={m.user.avatarUrl} />
                      <div className="min-w-0">
                        <p className="font-medium text-q-navy truncate">{m.user.name}</p>
                        <p className="text-xs text-gray truncate">{m.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={roleVariant[m.role] ?? 'default'}>
                      {roleLabel[m.role] ?? m.role}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={m.status === 'active' ? 'success' : 'default'}>
                      {m.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-gray">
                    {new Date(m.joinedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
