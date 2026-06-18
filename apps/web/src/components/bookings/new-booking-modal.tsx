'use client'

import { useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Court {
  id: string
  name: string
  sport: string
  pricePerHour: number
}

interface Props {
  open: boolean
  onClose: () => void
  clubId: string
  courts: Court[]
  defaultDate?: string | undefined
  defaultCourtId?: string | undefined
  defaultStartTime?: string | undefined
}

const schema = z
  .object({
    courtId: z.string().min(1, 'Selecione uma quadra'),
    date: z.string().min(1, 'Selecione a data'),
    startTime: z.string().min(1, 'Horário de início obrigatório'),
    endTime: z.string().min(1, 'Horário de término obrigatório'),
    price: z.coerce.number().min(0),
    notes: z.string().optional(),
  })
  .refine((d) => d.startTime < d.endTime, {
    message: 'O término deve ser depois do início',
    path: ['endTime'],
  })

type FormData = z.infer<typeof schema>

function calcPrice(startTime: string, endTime: string, pricePerHour: number): number {
  if (!startTime || !endTime || startTime >= endTime) return 0
  const startParts = startTime.split(':')
  const endParts = endTime.split(':')
  const sh = Number(startParts[0] ?? 0)
  const sm = Number(startParts[1] ?? 0)
  const eh = Number(endParts[0] ?? 0)
  const em = Number(endParts[1] ?? 0)
  const hours = (eh * 60 + em - sh * 60 - sm) / 60
  return Math.round(hours * pricePerHour * 100) / 100
}

export function NewBookingModal({
  open,
  onClose,
  clubId,
  courts,
  defaultDate,
  defaultCourtId,
  defaultStartTime,
}: Props) {
  const qc = useQueryClient()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: defaultDate ?? new Date().toISOString().substring(0, 10),
      courtId: defaultCourtId ?? '',
      startTime: defaultStartTime ?? '',
    },
  })

  // Sync defaults when modal opens with pre-filled values
  useEffect(() => {
    if (open) {
      if (defaultCourtId) setValue('courtId', defaultCourtId)
      if (defaultStartTime) setValue('startTime', defaultStartTime)
      if (defaultDate) setValue('date', defaultDate)
    }
  }, [open, defaultCourtId, defaultStartTime, defaultDate, setValue])

  const watchCourt = watch('courtId')
  const watchStart = watch('startTime')
  const watchEnd = watch('endTime')

  const selectedCourt = courts.find((c) => c.id === watchCourt)

  // Auto-calculate price when times or court change
  useEffect(() => {
    if (selectedCourt && watchStart && watchEnd) {
      setValue('price', calcPrice(watchStart, watchEnd, selectedCourt.pricePerHour))
    }
  }, [watchCourt, watchStart, watchEnd, selectedCourt, setValue])

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const startTime = new Date(`${data.date}T${data.startTime}:00`).toISOString()
      const endTime = new Date(`${data.date}T${data.endTime}:00`).toISOString()
      return api.post(`/clubs/${clubId}/bookings`, {
        courtId: data.courtId,
        startTime,
        endTime,
        price: data.price,
        ...(data.notes ? { notes: data.notes } : {}),
      })
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['bookings', clubId] })
      reset()
      onClose()
      toast('Reserva criada com sucesso!', { variant: 'success' })
    },
    onError: (err) => toast((err as { message?: string }).message ?? 'Erro ao criar reserva', { variant: 'error' }),
  })

  function handleClose() {
    reset()
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <Dialog.Title className="text-lg font-bold text-q-navy">Nova reserva</Dialog.Title>
              <Dialog.Description className="mt-0.5 text-sm text-gray">
                Preencha os dados para criar uma reserva manual
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="rounded-lg p-1.5 text-gray hover:bg-sand transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            {/* Quadra */}
            <div className="space-y-1.5">
              <Label htmlFor="courtId">Quadra</Label>
              <select
                id="courtId"
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-q-navy focus:outline-none focus:ring-2 focus:ring-q-blue"
                {...register('courtId')}
              >
                <option value="">Selecione a quadra</option>
                {courts.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.courtId && <p className="text-xs text-q-red">{errors.courtId.message}</p>}
            </div>

            {/* Data */}
            <div className="space-y-1.5">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" error={errors.date?.message} {...register('date')} />
            </div>

            {/* Horários */}
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

            {/* Valor */}
            <div className="space-y-1.5">
              <Label htmlFor="price">
                Valor (R$){' '}
                <span className="font-normal text-gray">
                  {selectedCourt ? `· R$ ${selectedCourt.pricePerHour}/h` : ''}
                </span>
              </Label>
              <Input
                id="price"
                type="number"
                min={0}
                step={0.01}
                error={errors.price?.message}
                {...register('price')}
              />
            </div>

            {/* Observações */}
            <div className="space-y-1.5">
              <Label htmlFor="notes">Observações <span className="font-normal text-gray">(opcional)</span></Label>
              <textarea
                id="notes"
                rows={2}
                placeholder="Ex: Pagamento no local, aula particular..."
                className="flex w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-q-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-q-blue focus:border-transparent transition-colors"
                {...register('notes')}
              />
            </div>

            {mutation.error && (
              <div className="rounded-md border border-q-red/20 bg-q-red/5 px-4 py-3 text-sm text-q-red">
                {(mutation.error as { message?: string }).message ?? 'Erro ao criar reserva'}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="gradient" className="flex-1" loading={isSubmitting || mutation.isPending}>
                Criar reserva
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
