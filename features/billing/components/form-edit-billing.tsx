import { InsertBillingFormValues } from '@/features/billing/schema'

import { useConfirm } from '@/hooks/use-confirm'
import { useGetBilling } from '@/features/billing/api/use-get-billing'
import { useEditBilling } from '@/features/billing/api/use-edit-billing'
import { useOpenBilling } from '@/features/billing/hooks/use-open-billing'
import { useDeleteBilling } from '@/features/billing/api/use-delete-billing'

import { FormDialogBilling } from '@/features/billing/components/form-dialog-billing'

export const FormEditBilling = () => {
  const { id, isOpen, onClose } = useOpenBilling()

  const [ConfirmationDialog, confirm] = useConfirm(
    'Deseja realmente continuar?',
    'Você não poderá reverter a ação depois, perdendo essa informação.',
  )

  const billingQuery = useGetBilling(id)
  const editMutation = useEditBilling(id)
  const deleteMutation = useDeleteBilling(id)

  const isPending = editMutation.isPending || deleteMutation.isPending

  const { data } = billingQuery

  if (!data) return null

  const defaultValues: InsertBillingFormValues = {
    ...data,
  }

  const onSubmit = async (values: InsertBillingFormValues) => {
    editMutation.mutate(
      { ...values },
      {
        onSuccess: () => {
          onClose()
        },
      },
    )
  }

  const handleDelete = async () => {
    const ok = await confirm()

    if (ok) {
      deleteMutation.mutate(undefined, { onSuccess: onClose })
    }
  }

  return (
    <>
      <ConfirmationDialog />
      <FormDialogBilling
        id={id}
        isOpen={isOpen}
        isPending={isPending}
        defaultValues={defaultValues}
        onDelete={handleDelete}
        handleClose={onClose}
        onSubmit={onSubmit}
      />
    </>
  )
}
