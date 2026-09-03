import { z } from 'zod'

import { passwordSchema, phoneSchema } from '@/features/common/schema'

export const insertUserSchema = z
  .object({
    name: z.string().min(1, { message: 'Nome é obrigatório' }),
    email: z.email({ message: 'Email é obrigatório' }),
    whatsApp: phoneSchema,

    password: z.union([passwordSchema, z.null()]),
    repeatPassword: z.union([
      z.string().min(1, { message: 'Repetir senha é obrigatório' }),
      z.null(),
    ]),

    hasAcceptedTerms: z.union([
      z.boolean().refine((value) => value, {
        message: 'Os termos de uso devem ser aceitos',
      }),
      z.null(),
    ]),
  })
  .superRefine((data, ctx) => {
    const hasPassword = data.password !== null && data.password !== ''
    const hasRepeatPassword =
      data.repeatPassword !== null && data.repeatPassword !== ''

    if (hasPassword && !hasRepeatPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Confirme sua senha',
        path: ['repeatPassword'],
      })
      return
    }

    if (!hasPassword && hasRepeatPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Digite sua senha primeiro',
        path: ['password'],
      })
      return
    }

    if (
      hasPassword &&
      hasRepeatPassword &&
      data.password !== data.repeatPassword
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'As senhas não coincidem',
        path: ['repeatPassword'],
      })
    }
  })

export type InsertUserFormValues = z.infer<typeof insertUserSchema>

export const insertUserDefaultValues: InsertUserFormValues = {
  name: '',
  email: '',
  whatsApp: '',

  password: null,
  repeatPassword: null,

  hasAcceptedTerms: false,
}

export const insertUserCompleteSchema = z.object({
  whatsApp: phoneSchema,
})

export type InsertUserCompleteFormValues = z.infer<
  typeof insertUserCompleteSchema
>
