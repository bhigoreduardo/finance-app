import { InsertTransactionFormValues } from '@/features/transaction/schema'

import { FormSheet } from '@/components/form-sheet'
import { FormTransaction } from '@/features/transaction/components/form-transaction'

type Props = {
  id?: string
  isOpen: boolean
  isPending: boolean
  defaultValues: InsertTransactionFormValues
  onDelete?: () => void
  handleClose: () => void
  onSubmit: (values: InsertTransactionFormValues) => void
}

export const FormSheetTransaction = ({
  id,
  isOpen,
  isPending,
  defaultValues,
  onDelete,
  handleClose,
  onSubmit,
}: Props) => {
  const formId = 'form-transaction'

  return (
    <FormSheet
      formId={formId}
      title={id ? 'Editar transação' : 'Nova transação'}
      description="Preencha os campos abaixo, e ao finalizar clique em “Salvar”."
      isOpen={isOpen}
      isPending={isPending}
      handleClose={handleClose}
      className="w-full! md:max-w-3xl"
    >
      <FormTransaction
        id={id}
        formId={formId}
        isPending={isPending}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        onDelete={onDelete}
      />
    </FormSheet>
  )
}
