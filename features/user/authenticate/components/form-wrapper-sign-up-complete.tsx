import { InsertUserCompleteFormValues } from '@/features/user/schema'

import { useCurrentUser } from '@/features/user/authenticate/hooks/use-current-user'
import { useSignUpComplete } from '@/features/user/authenticate/api/use-sign-up-complete'

import { FormSignUpComplete } from '@/features/user/authenticate/components/form-sign-up-complete'

export const FormWrapperSignUpComplete = () => {
  const { update } = useCurrentUser()
  const mutation = useSignUpComplete()
  const isPending = mutation.isPending

  const defaultValues: InsertUserCompleteFormValues = {
    whatsApp: '',
  }

  const onSubmit = (values: InsertUserCompleteFormValues) => {
    mutation.mutate(
      { ...values },
      {
        onSuccess: async () => {
          await update()
          window.location.href = '/'
        },
      },
    )
  }

  return (
    <FormSignUpComplete
      defaultValues={defaultValues}
      isPending={isPending}
      onSubmit={onSubmit}
    />
  )
}
