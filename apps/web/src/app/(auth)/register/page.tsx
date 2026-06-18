'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/contexts/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const { register: registerUser } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setServerError(null)
    try {
      await registerUser(data.name, data.email, data.password)
      router.push('/app')
    } catch (err) {
      const msg = (err as { message?: string }).message
      setServerError(msg ?? 'Erro ao criar conta. Tente novamente.')
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Mobile-only logo */}
      <div className="mb-8 flex flex-col items-center lg:hidden">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-[18px] bg-grad-sun shadow-lg">
          <div className="h-7 w-7 rounded-full border-[5px] border-white" />
        </div>
        <span className="text-2xl font-black text-q-navy">Quadrik</span>
      </div>

      <h2 className="mb-1 text-2xl font-bold text-q-navy">Criar sua conta</h2>
      <p className="mb-8 text-sm text-gray">Comece a gerenciar sua arena hoje</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            type="text"
            placeholder="Seu nome"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name')}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="voce@exemplo.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repita a senha"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        {serverError && (
          <div className="rounded-md border border-q-red/20 bg-q-red/5 px-4 py-3 text-sm text-q-red">
            {serverError}
          </div>
        )}

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          loading={isSubmitting}
          className="w-full"
        >
          Criar conta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray">
        Já tem conta?{' '}
        <Link href="/login" className="font-medium text-q-blue hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}
