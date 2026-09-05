import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'

import {
  ResetPasswordFormValues,
  resetPasswordDefaultValues,
} from '@/features/user/authenticate/schema'

import { useResetPassword } from '@/features/user/authenticate/api/use-reset-password'

import { FormResetPassword } from '@/features/user/authenticate/components/form-reset-password'

export const FormWrapperResetPassword = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? undefined

  const mutation = useResetPassword(token)
  const isPending = mutation.isPending

  if (!token) {
    toast.error('Token inválido')
    router.push('/entrar')
    return null
  }

  const defaultValues: ResetPasswordFormValues = {
    ...resetPasswordDefaultValues,
  }

  const onSubmit = (values: ResetPasswordFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        router.push('/entrar')
      },
    })
  }

  return (
    <FormResetPassword
      defaultValues={defaultValues}
      isPending={isPending}
      onSubmit={onSubmit}
    />
  )
}
