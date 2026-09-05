import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from '@/features/user/authenticate/schema'

import { Form } from '@/components/ui/form'
import { FormWrapper } from '@/components/form-wrapper'
import { ButtonLoading } from '@/components/button-loading'

import { FormSecurity } from '@/features/common/components/form-security'

type Props = {
  isPending: boolean
  defaultValues: ResetPasswordFormValues
  onSubmit: (values: ResetPasswordFormValues) => void
}

export const FormResetPassword = ({
  isPending,
  defaultValues,
  onSubmit,
}: Props) => {
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues,
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const handleSubmit = (values: ResetPasswordFormValues) => {
    onSubmit(values)
    form.reset()
  }

  return (
    <FormWrapper
      title="Redefinir senha"
      description="Escolha uma senha nova para sua conta."
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-2"
        >
          <FormSecurity isPending={isPending} isNonGrid />
          <ButtonLoading className="w-fit" disabled={isPending}>
            Redefinir senha
          </ButtonLoading>
        </form>
      </Form>
    </FormWrapper>
  )
}
