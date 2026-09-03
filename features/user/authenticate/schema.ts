import { z } from 'zod'

import { passwordSchema } from '@/features/common/schema'

export const signInSchema = z.object({
  email: z.email({ message: 'E-mail é obrigatório' }),
  password: z.string().min(1, { message: 'Senha é obrigatório' }),
  code: z.string().nullish(),
})

export type SignInFormValues = z.infer<typeof signInSchema>

export const signInDefaultValues: SignInFormValues = {
  email: '',
  password: '',
  code: null,
}

export const forgotPasswordSchema = z.object({
  email: z.email({ message: 'Email é obrigatório' }),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export const forgotPasswordDefaultValues: ForgotPasswordFormValues = {
  email: '',
}

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    repeatPassword: z
      .string()
      .min(1, { message: 'Repetir senha é obrigatório' }),
  })
  .refine(
    (data) => {
      if (data.password !== data.repeatPassword) return false
      return true
    },
    {
      message: 'Repetir senha deve ser igual a senha',
      path: ['repeatPassword'],
    },
  )

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export const resetPasswordDefaultValues: ResetPasswordFormValues = {
  password: '',
  repeatPassword: '',
}
