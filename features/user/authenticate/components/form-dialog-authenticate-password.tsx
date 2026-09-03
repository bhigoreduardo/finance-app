import {
  updatePasswordDefaultValues,
  UpdatePasswordFormValues,
} from '@/features/common/schema'

import { useUpdatePassword } from '@/features/user/authenticate/api/use-update-password'
import { useOpenAuthenticatePassword } from '@/features/user/authenticate/hooks/use-authenticate'

import { FormDialog } from '@/components/form-dialog'
import { FormUpdatePassword } from '@/features/common/components/form-update-password'

export const FormDialogAuthenticatePassword = () => {
  const { isOpen, onClose } = useOpenAuthenticatePassword()

  const mutation = useUpdatePassword()
  const isPending = mutation.isPending

  const formId = 'form-user-password'

  const title = 'Segurança'
  const description = 'Gerencie as informações de segurança da sua conta'
  const className = 'max-w-[90%] md:max-w-md max-h-[90vh]'

  const onSubmit = (values: UpdatePasswordFormValues) => {
    mutation.mutate({ ...values }, { onSuccess: onClose })
  }

  return (
    <FormDialog
      formId={formId}
      title={title}
      description={description}
      isOpen={isOpen}
      isPending={isPending}
      handleClose={onClose}
      className={className}
    >
      <FormUpdatePassword
        formId={formId}
        isPending={isPending}
        defaultValues={updatePasswordDefaultValues}
        onSubmit={onSubmit}
        isNonColumn={false}
      />
    </FormDialog>
  )
}
