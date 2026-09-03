import { z } from 'zod'

import { removeMask } from '@/lib/format'

export const phoneSchema = z
  .string()
  .min(1, { message: 'Número é obrigatório' })
  .transform((value) => removeMask(value))
  .refine((value) => /^\d{10,11}$/.test(value), {
    message: 'Número deve conter entre 10 e 11 dígitos numéricos',
  })

export const passwordSchema = z
  .string()
  .min(6, { message: 'Mínimo 6 caracteres' })
  .refine(
    (password) => {
      let strength = 0
      if (password.length >= 6) strength += 25
      if (password.match(/[A-Z]/)) strength += 25
      if (password.match(/[0-9]/)) strength += 25
      if (password.match(/[^A-Za-z0-9]/)) strength += 25
      return strength >= 75
    },
    {
      message:
        'A senha deve conter pelo menos 6 caracteres, incluindo maiúsculas, números e símbolos',
    },
  )

export const updatePasswordSchema = z
  .object({
    password: z
      .string({ message: 'Senha é obrigatório' })
      .min(1, { message: 'Senha é obrigatório' }),
    newPassword: passwordSchema,
    repeatPassword: z
      .string({ message: 'Repetir senha é obrigatório' })
      .min(1, { message: 'Repetir senha é obrigatório' }),
  })
  .refine(
    (data) => {
      if (data.newPassword !== data.repeatPassword) return false
      return true
    },
    {
      message: 'Repetir deve ser igual a nova senha',
      path: ['repeatPassword'],
    },
  )

export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>

export const updatePasswordDefaultValues: UpdatePasswordFormValues = {
  newPassword: '',
  password: '',
  repeatPassword: '',
}
