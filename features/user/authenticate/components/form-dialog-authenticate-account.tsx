import { BadgeInfoIcon } from 'lucide-react'

import { InsertUserFormValues } from '@/features/user/schema'

import { useUpdate } from '@/features/user/authenticate/api/use-update'
import { useGetUserCurrent } from '@/features/user/authenticate/api/use-get-user-current'
import { useOpenAuthenticateAccount } from '@/features/user/authenticate/hooks/use-authenticate'

import { FormDialog } from '@/components/form-dialog'
import { FormUser } from '@/features/user/components/form-user'
import { FormWrapperUpdate2fa } from '@/features/user/authenticate/components/form-wrapper-update-2fa'

export const FormDialogAuthenticateAccount = () => {
  const userQuery = useGetUserCurrent()
  const { isOpen, onClose } = useOpenAuthenticateAccount()

  const mutation = useUpdate()

  const formId = 'form-user'

  const title = 'Conta'
  const description = 'Gerencie suas informações pessoais de acesso'
  const className = 'max-w-[90%] md:max-w-md max-h-[90vh]'

  const { data } = userQuery

  if (!data) return null

  const defaultValues: InsertUserFormValues = {
    ...data,
    password: null,
    repeatPassword: null,

    hasAcceptedTerms: null,
  }

  const isPending = mutation.isPending

  const onSubmit = async (values: InsertUserFormValues) => {
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
      {data.isOauth ? (
        <div className="flex gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
          <BadgeInfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Conta autenticada com Google</p>
            <p>
              Você está utilizando sua conta do Google para acessar o sistema.
              Por esse motivo, o endereço de e-mail não pode ser alterado nesta
              tela.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-end">
          <FormWrapperUpdate2fa />
        </div>
      )}

      <FormUser
        formId={formId}
        isPending={isPending}
        isUpdated
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        isOauth={data.isOauth}
      />
    </FormDialog>
  )
}
