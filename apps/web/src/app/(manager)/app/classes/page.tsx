'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'

interface TeacherUser {
  id: string
  name: string
  avatarUrl: string | null
}

interface Teacher {
  id: string
  userId: string
  user: TeacherUser | null
}

interface ClassItem {
  id: string
  name: string
  sportType: string
  level: string
  maxStudents: number
  pricePerMonth: string | number
  schedule: Array<{ dayOfWeek: number; startTime: string; endTime: string }>
  startDate: string
  endDate: string | null
  status: string
  teacher: Teacher
  _count: { students: number }
}

interface Member {
  id: string
  role: string
  status: string
  user: { id: string; name: string }
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
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
}

const LEVEL_VARIANT: Record<string, 'default' | 'success' | 'warning' | 'info'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'info',
}

const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function formatCurrency(v: string | number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v))
}

function scheduleLabel(schedule: ClassItem['schedule']) {
  if (!schedule.length) return '–'
  const days = schedule.map((s) => DAY_LABELS[s.dayOfWeek] ?? '?').join(', ')
  const first = schedule[0]
  return first ? `${days} · ${first.startTime}–${first.endTime}` : days
}

const schema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  sportType: z.string().min(1, 'Selecione o esporte'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  teacherUserId: z.string().min(1, 'Selecione um professor'),
  maxStudents: z.coerce.number().int().min(1),
  pricePerMonth: z.coerce.number().min(0),
  days: z.array(z.number()).min(1, 'Selecione ao menos um dia'),
  startTime: z.string().min(1, 'Horário de início obrigatório'),
  endTime: z.string().min(1, 'Horário de término obrigatório'),
  startDate: z.string().min(1, 'Data de início obrigatória'),
  endDate: z.string().optional(),
})
type FormData = z.infer<typeof schema>

function NewClassModal({
  open,
  onClose,
  clubId,
  teacherMembers,
}: {
  open: boolean
  onClose: () => void
  clubId: string
  teacherMembers: Member[]
}) {
  const qc = useQueryClient()
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { level: 'beginner', days: [], maxStudents: 8, pricePerMonth: 0 },
  })

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      api.post(`/clubs/${clubId}/classes`, {
        name: data.name,
        sportType: data.sportType,
        level: data.level,
        teacherUserId: data.teacherUserId,
        maxStudents: data.maxStudents,
        pricePerMonth: data.pricePerMonth,
        schedule: data.days.sort().map((d) => ({
          dayOfWeek: d,
          startTime: data.startTime,
          endTime: data.endTime,
        })),
        startDate: data.startDate,
        ...(data.endDate ? { endDate: data.endDate } : {}),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['classes', clubId] })
      reset()
      onClose()
      toast('Turma criada com sucesso!', { variant: 'success' })
    },
    onError: (err) =>
      toast((err as { message?: string }).message ?? 'Erro ao criar turma', { variant: 'error' }),
  })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4">
      <div className="mt-8 mb-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-q-navy">Nova turma</h2>
            <p className="mt-0.5 text-sm text-gray">Preencha os dados da turma de aulas</p>
          </div>
          <button
            onClick={() => { reset(); onClose() }}
            className="rounded-lg p-1.5 text-gray hover:bg-sand transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome da turma</Label>
            <Input id="name" placeholder="Ex: Beach Tennis Iniciantes" error={errors.name?.message} {...register('name')} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="sportType">Esporte</Label>
              <select
                id="sportType"
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-q-navy focus:outline-none focus:ring-2 focus:ring-q-blue"
                {...register('sportType')}
              >
                <option value="">Selecione</option>
                {Object.entries(SPORTS_PT).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              {errors.sportType && <p className="text-xs text-q-red">{errors.sportType.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="level">Nível</Label>
              <select
                id="level"
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-q-navy focus:outline-none focus:ring-2 focus:ring-q-blue"
                {...register('level')}
              >
                <option value="beginner">Iniciante</option>
                <option value="intermediate">Intermediário</option>
                <option value="advanced">Avançado</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="teacherUserId">Professor</Label>
            <select
              id="teacherUserId"
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-q-navy focus:outline-none focus:ring-2 focus:ring-q-blue"
              {...register('teacherUserId')}
            >
              <option value="">Selecione o professor</option>
              {teacherMembers.map((m) => (
                <option key={m.user.id} value={m.user.id}>{m.user.name}</option>
              ))}
            </select>
            {errors.teacherUserId && <p className="text-xs text-q-red">{errors.teacherUserId.message}</p>}
            {teacherMembers.length === 0 && (
              <p className="text-xs text-gray">
                Nenhum membro com papel "Professor". Adicione um professor na página de Membros primeiro.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="maxStudents">Máx. alunos</Label>
              <Input id="maxStudents" type="number" min={1} error={errors.maxStudents?.message} {...register('maxStudents')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pricePerMonth">Mensalidade (R$)</Label>
              <Input id="pricePerMonth" type="number" min={0} step={0.01} error={errors.pricePerMonth?.message} {...register('pricePerMonth')} />
            </div>
          </div>

          {/* Days of week */}
          <div className="space-y-1.5">
            <Label>Dias da semana</Label>
            <Controller
              control={control}
              name="days"
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {DAY_LABELS.map((label, idx) => {
                    const selected = field.value.includes(idx)
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          field.onChange(
                            selected ? field.value.filter((d) => d !== idx) : [...field.value, idx],
                          )
                        }}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                          selected
                            ? 'bg-q-navy text-white'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              )}
            />
            {errors.days && <p className="text-xs text-q-red">{errors.days.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startTime">Início</Label>
              <Input id="startTime" type="time" error={errors.startTime?.message} {...register('startTime')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endTime">Término</Label>
              <Input id="endTime" type="time" error={errors.endTime?.message} {...register('endTime')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Data de início</Label>
              <Input id="startDate" type="date" error={errors.startDate?.message} {...register('startDate')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate">
                Data de término <span className="font-normal text-gray">(opcional)</span>
              </Label>
              <Input id="endDate" type="date" {...register('endDate')} />
            </div>
          </div>

          {mutation.error && (
            <div className="rounded-md border border-q-red/20 bg-q-red/5 px-4 py-3 text-sm text-q-red">
              {(mutation.error as { message?: string }).message ?? 'Erro ao criar turma'}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={() => { reset(); onClose() }}>
              Cancelar
            </Button>
            <Button type="submit" variant="gradient" className="flex-1" loading={isSubmitting || mutation.isPending}>
              Criar turma
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ClassesPage() {
  const { user } = useAuth()
  const clubId = user?.clubId ?? ''
  const qc = useQueryClient()
  const [showModal, setShowModal] = useState(false)

  const { data: classes, isLoading } = useQuery<ClassItem[]>({
    queryKey: ['classes', clubId],
    queryFn: () => api.get<ClassItem[]>(`/clubs/${clubId}/classes`),
    enabled: !!clubId,
  })

  const { data: members } = useQuery<Member[]>({
    queryKey: ['members', clubId],
    queryFn: () => api.get<Member[]>(`/clubs/${clubId}/members`),
    enabled: !!clubId,
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ classId, status }: { classId: string; status: string }) =>
      api.patch(`/clubs/${clubId}/classes/${classId}/status`, { status }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['classes', clubId] }),
    onError: (err) => toast((err as { message?: string }).message ?? 'Erro', { variant: 'error' }),
  })

  const deleteMutation = useMutation({
    mutationFn: (classId: string) => api.delete(`/clubs/${clubId}/classes/${classId}`),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['classes', clubId] })
      toast('Turma removida.', { variant: 'success' })
    },
    onError: (err) => toast((err as { message?: string }).message ?? 'Erro', { variant: 'error' }),
  })

  const teacherMembers = members?.filter((m) => m.role === 'TEACHER' && m.status === 'active') ?? []
  const activeCount = classes?.filter((c) => c.status === 'active').length ?? 0

  return (
    <>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-q-navy">Aulas</h1>
            <p className="mt-1 text-sm text-gray">{activeCount} turma{activeCount !== 1 ? 's' : ''} ativa{activeCount !== 1 ? 's' : ''}</p>
          </div>
          <Button variant="gradient" onClick={() => setShowModal(true)}>
            + Nova turma
          </Button>
        </div>

        {/* Classes list */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-white" />
            ))}
          </div>
        ) : classes?.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-white">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sand">
              <span className="text-2xl">📚</span>
            </div>
            <div className="text-center">
              <p className="font-medium text-q-navy">Nenhuma turma cadastrada</p>
              <p className="mt-0.5 text-sm text-gray">Crie sua primeira turma de aulas</p>
            </div>
            <Button variant="gradient" onClick={() => setShowModal(true)}>
              + Criar turma
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {classes?.map((cls) => (
              <div
                key={cls.id}
                className={`relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm transition-opacity ${
                  cls.status === 'inactive' ? 'opacity-60' : ''
                }`}
              >
                {/* Sport accent */}
                <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-q-red to-q-orange" />

                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{SPORT_EMOJI[cls.sportType] ?? '🎾'}</span>
                      <h3 className="font-bold text-q-navy truncate">{cls.name}</h3>
                    </div>
                    <p className="mt-0.5 text-xs text-gray">
                      {SPORTS_PT[cls.sportType] ?? cls.sportType}
                    </p>
                  </div>
                  <Badge variant={LEVEL_VARIANT[cls.level] ?? 'default'}>
                    {LEVEL_PT[cls.level] ?? cls.level}
                  </Badge>
                </div>

                <div className="mt-3 space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-gray">
                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{cls.teacher.user?.name ?? 'Professor não encontrado'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray">
                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{scheduleLabel(cls.schedule)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray">
                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{cls._count.students}/{cls.maxStudents} alunos</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
                  <p className="font-bold text-q-navy">{formatCurrency(cls.pricePerMonth)}<span className="text-xs font-normal text-gray">/mês</span></p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        toggleStatusMutation.mutate({
                          classId: cls.id,
                          status: cls.status === 'active' ? 'inactive' : 'active',
                        })
                      }
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                        cls.status === 'active'
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {cls.status === 'active' ? 'Ativa' : 'Inativa'}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remover turma "${cls.name}"?`)) deleteMutation.mutate(cls.id)
                      }}
                      className="rounded-lg p-1.5 text-gray hover:bg-q-red/10 hover:text-q-red transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <NewClassModal
        open={showModal}
        onClose={() => setShowModal(false)}
        clubId={clubId}
        teacherMembers={teacherMembers}
      />
    </>
  )
}
