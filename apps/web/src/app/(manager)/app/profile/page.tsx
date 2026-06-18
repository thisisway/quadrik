'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/auth'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Me {
  id: string
  name: string
  email: string
  phone: string | null
  avatarUrl: string | null
  memberships: Array<{ role: string; club: { name: string } }>
}

const profileSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  phone: z.string().optional(),
})
type ProfileData = z.infer<typeof profileSchema>

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Senha atual obrigatória'),
    newPassword: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  })
type PasswordData = z.infer<typeof passwordSchema>

const roleLabel: Record<string, string> = {
  OWNER: 'Proprietário',
  MANAGER: 'Gerente',
  RECEPTIONIST: 'Recepcionista',
  FINANCE: 'Financeiro',
  TEACHER: 'Professor',
  ORGANIZER: 'Organizador',
  PLAYER: 'Jogador',
}

export default function ProfilePage() {
  const { user, updateClub } = useAuth()

  const { data: me } = useQuery<Me>({
    queryKey: ['me'],
    queryFn: () => api.get<Me>('/auth/me'),
    enabled: !!user,
  })

  const {
    register: regProfile,
    handleSubmit: submitProfile,
    reset: resetProfile,
    formState: { errors: errP, isSubmitting: submittingP, isDirty: dirtyP },
  } = useForm<ProfileData>({ resolver: zodResolver(profileSchema) })

  const {
    register: regPassword,
    handleSubmit: submitPassword,
    reset: resetPassword,
    formState: { errors: errPw, isSubmitting: submittingPw },
  } = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) })

  useEffect(() => {
    if (me) {
      resetProfile({ name: me.name, phone: me.phone ?? '' })
    }
  }, [me, resetProfile])

  const profileMutation = useMutation({
    mutationFn: (data: ProfileData) => api.patch('/auth/me', data),
    onSuccess: () => {
      toast('Perfil atualizado!', { variant: 'success' })
      resetProfile({}, { keepValues: true })
    },
    onError: (err) => toast((err as { message?: string }).message ?? 'Erro ao salvar', { variant: 'error' }),
  })

  const passwordMutation = useMutation({
    mutationFn: (data: PasswordData) =>
      api.patch('/auth/me/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      toast('Senha alterada com sucesso!', { variant: 'success' })
      resetPassword()
    },
    onError: (err) => toast((err as { message?: string }).message ?? 'Senha atual incorreta', { variant: 'error' }),
  })

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-q-navy">Meu perfil</h1>
        <p className="mt-1 text-sm text-gray">Gerencie suas informações pessoais</p>
      </div>

      {/* Avatar + identity */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-grad-sun text-xl font-black text-white">
            {initials ?? '?'}
          </div>
          <div>
            <p className="text-lg font-bold text-q-navy">{user?.name}</p>
            <p className="text-sm text-gray">{user?.email}</p>
            {me?.memberships.map((m, i) => (
              <p key={i} className="mt-1 text-xs text-gray">
                {roleLabel[m.role] ?? m.role} · {m.club.name}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Profile form */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 font-semibold text-q-navy">Dados pessoais</h2>
        <form
          onSubmit={submitProfile((d) => profileMutation.mutate(d))}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" error={errP.name?.message} {...regProfile('name')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user?.email ?? ''}
              disabled
              className="opacity-60"
            />
            <p className="text-xs text-gray">O email não pode ser alterado</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" placeholder="(27) 99999-9999" {...regProfile('phone')} />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="gradient"
              loading={submittingP || profileMutation.isPending}
              disabled={!dirtyP}
            >
              Salvar
            </Button>
          </div>
        </form>
      </div>

      {/* Password form */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 font-semibold text-q-navy">Alterar senha</h2>
        <form
          onSubmit={submitPassword((d) => passwordMutation.mutate(d))}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">Senha atual</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="••••••••"
              error={errPw.currentPassword?.message}
              {...regPassword('currentPassword')}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">Nova senha</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Mínimo 8 caracteres"
              error={errPw.newPassword?.message}
              {...regPassword('newPassword')}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repita a nova senha"
              error={errPw.confirmPassword?.message}
              {...regPassword('confirmPassword')}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              loading={submittingPw || passwordMutation.isPending}
            >
              Alterar senha
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
