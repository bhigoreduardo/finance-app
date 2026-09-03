import { InsertBillingFormValues } from '@/features/billing/schema'

import { FormDialog } from '@/components/form-dialog'
import { FormBilling } from '@/features/billing/components/form-billing'

type Props = {
  id?: string
  isOpen: boolean
  isPending: boolean
  defaultValues: InsertBillingFormValues
  onDelete?: () => void
  handleClose: () => void
  onSubmit: (values: InsertBillingFormValues) => void
}

export const FormDialogBilling = ({
  id,
  isOpen,
  isPending,
  defaultValues,
  onDelete,
  handleClose,
  onSubmit,
}: Props) => {
  const formId = 'form-billing'

  return (
    <FormDialog
      formId={formId}
      title={id ? 'Editar conta' : 'Nova conta'}
      description="Preencha os campos abaixo, e ao finalizar clique em “Salvar”."
      isOpen={isOpen}
      isPending={isPending}
      handleClose={handleClose}
      className="max-w-[90%] md:max-w-md"
    >
      <FormBilling
        id={id}
        formId={formId}
        isPending={isPending}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        onDelete={onDelete}
      />
    </FormDialog>
  )
}
