import {
  insertTransactionDefaultValues,
  InsertTransactionFormValues,
} from '@/features/transaction/schema'

import { convertAmountToMiliunits } from '@/lib/utils'

import { useNewTransaction } from '@/features/transaction/hooks/use-new-transaction'
import { useCreateTransaction } from '@/features/transaction/api/use-create-transaction'

import { FormSheetTransaction } from '@/features/transaction/components/form-sheet-transaction'

export const FormNewTransaction = () => {
  const { isOpen, onClose } = useNewTransaction()

  const mutation = useCreateTransaction()
  const isPending = mutation.isPending

  const defaultValues: InsertTransactionFormValues = {
    ...insertTransactionDefaultValues,
  }

  const onSubmit = async (values: InsertTransactionFormValues) => {
    const { amount } = values

    mutation.mutate(
      {
        ...values,
        amount: convertAmountToMiliunits(amount),
      },
      { onSuccess: onClose },
    )
  }

  return (
    <FormSheetTransaction
      isOpen={isOpen}
      isPending={isPending}
      defaultValues={defaultValues}
      handleClose={onClose}
      onSubmit={onSubmit}
    />
  )
}
