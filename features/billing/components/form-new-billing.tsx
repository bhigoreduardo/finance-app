import {
  insertBillingDefaultValues,
  InsertBillingFormValues,
} from '@/features/billing/schema'

import { useNewBilling } from '@/features/billing/hooks/use-new-billing'
import { useCreateBilling } from '@/features/billing/api/use-create-billing'

import { FormDialogBilling } from '@/features/billing/components/form-dialog-billing'

export const FormNewBilling = () => {
  const { isOpen, onClose } = useNewBilling()

  const mutation = useCreateBilling()
  const isPending = mutation.isPending

  const defaultValues: InsertBillingFormValues = {
    ...insertBillingDefaultValues,
  }

  const onSubmit = async (values: InsertBillingFormValues) => {
    mutation.mutate(
      { ...values },
      {
        onSuccess: () => {
          onClose()
        },
      },
    )
  }

  return (
    <FormDialogBilling
      isOpen={isOpen}
      isPending={isPending}
      defaultValues={defaultValues}
      handleClose={onClose}
      onSubmit={onSubmit}
    />
  )
}
