import { InsertTransactionFormValues } from '@/features/transaction/schema'

import { convertAmountToMiliunits } from '@/lib/utils'

import { useConfirm } from '@/hooks/use-confirm'

import { useGetTransaction } from '@/features/transaction/api/use-get-transaction'
import { useEditTransaction } from '@/features/transaction/api/use-edit-transaction'
import { useOpenTransaction } from '@/features/transaction/hooks/use-open-transaction'
import { useDeleteTransaction } from '@/features/transaction/api/use-delete-transaction'

import { FormSheetTransaction } from '@/features/transaction/components/form-sheet-transaction'

export const FormEditTransaction = () => {
  const { id, isOpen, onClose } = useOpenTransaction()

  const [ConfirmationDialog, confirm] = useConfirm(
    'Deseja realmente continuar?',
    'Você não poderá reverter a ação depois, perdendo essa informação.',
  )

  const editMutation = useEditTransaction(id)
  const transactionQuery = useGetTransaction(id)
  const deleteMutation = useDeleteTransaction(id)

  const isPending = editMutation.isPending || deleteMutation.isPending

  const { data } = transactionQuery

  if (!data) return null

  const defaultValues: InsertTransactionFormValues = {
    ...data,
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
    amount: data.amount.toString(),
  }

  const onSubmit = async (values: InsertTransactionFormValues) => {
    const { amount } = values

    editMutation.mutate(
      {
        ...values,
        amount: convertAmountToMiliunits(amount),
      },
      { onSuccess: onClose },
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
      <FormSheetTransaction
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
