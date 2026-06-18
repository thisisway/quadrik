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
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setServerError(null)
    try {
      await login(data.email, data.password)
      router.push('/app')
    } catch (err) {
      const msg = (err as { message?: string }).message
      setServerError(msg ?? 'Erro ao entrar. Tente novamente.')
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

      <h2 className="mb-1 text-2xl font-bold text-q-navy">Bem-vindo de volta</h2>
      <p className="mb-8 text-sm text-gray">Entre com sua conta para continuar</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link href="#" className="text-xs text-q-blue hover:underline">
              Esqueceu a senha?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
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
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray">
        Não tem conta?{' '}
        <Link href="/register" className="font-medium text-q-blue hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  )
}
