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

export default function PlayerProfilePage() {
  const { user } = useAuth()

  const { data: me } = useQuery<Me>({
    queryKey: ['me'],
    queryFn: () => api.get<Me>('/auth/me'),
    enabled: !!user,
  })

  const {
    register: regProfile,
    handleSubmit: submitProfile,
    reset: resetProfile,
    formState: { errors: errP, isDirty: dirtyP },
  } = useForm<ProfileData>({ resolver: zodResolver(profileSchema) })

  const {
    register: regPw,
    handleSubmit: submitPw,
    reset: resetPw,
    formState: { errors: errPw },
  } = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) })

  useEffect(() => {
    if (me) resetProfile({ name: me.name, phone: me.phone ?? '' })
  }, [me, resetProfile])

  const profileMutation = useMutation({
    mutationFn: (data: ProfileData) => api.patch('/auth/me', data),
    onSuccess: () => { toast('Perfil atualizado!', { variant: 'success' }); resetProfile({}, { keepValues: true }) },
    onError: (err) => toast((err as { message?: string }).message ?? 'Erro', { variant: 'error' }),
  })

  const passwordMutation = useMutation({
    mutationFn: (data: PasswordData) =>
      api.patch('/auth/me/password', { currentPassword: data.currentPassword, newPassword: data.newPassword }),
    onSuccess: () => { toast('Senha alterada!', { variant: 'success' }); resetPw() },
    onError: (err) => toast((err as { message?: string }).message ?? 'Senha atual incorreta', { variant: 'error' }),
  })

  const initials = user?.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-q-navy">Meu perfil</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-grad-sun text-lg font-black text-white">
          {initials}
        </div>
        <div>
          <p className="font-bold text-q-navy">{user?.name}</p>
          <p className="text-sm text-gray">{user?.email}</p>
          {me?.memberships.map((m, i) => (
            <p key={i} className="text-xs text-gray">{m.club.name}</p>
          ))}
        </div>
      </div>

      {/* Profile form */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-q-navy">Dados pessoais</h2>
        <form onSubmit={submitProfile((d) => profileMutation.mutate(d))} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nome</Label>
            <Input error={errP.name?.message} {...regProfile('name')} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={user?.email ?? ''} disabled className="opacity-60" />
          </div>
          <div className="space-y-1.5">
            <Label>Telefone</Label>
            <Input placeholder="(27) 99999-9999" {...regProfile('phone')} />
          </div>
          <div className="flex justify-end">
            <Button variant="gradient" type="submit" loading={profileMutation.isPending} disabled={!dirtyP}>
              Salvar
            </Button>
          </div>
        </form>
      </div>

      {/* Password form */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-q-navy">Alterar senha</h2>
        <form onSubmit={submitPw((d) => passwordMutation.mutate(d))} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Senha atual</Label>
            <Input type="password" placeholder="••••••••" error={errPw.currentPassword?.message} {...regPw('currentPassword')} />
          </div>
          <div className="space-y-1.5">
            <Label>Nova senha</Label>
            <Input type="password" placeholder="Mínimo 8 caracteres" error={errPw.newPassword?.message} {...regPw('newPassword')} />
          </div>
          <div className="space-y-1.5">
            <Label>Confirmar nova senha</Label>
            <Input type="password" placeholder="Repita a nova senha" error={errPw.confirmPassword?.message} {...regPw('confirmPassword')} />
          </div>
          <div className="flex justify-end">
            <Button variant="primary" type="submit" loading={passwordMutation.isPending}>
              Alterar senha
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
