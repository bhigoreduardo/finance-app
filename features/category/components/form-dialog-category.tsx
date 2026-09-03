import { InsertCategoryFormValues } from '@/features/category/schema'

import { FormDialog } from '@/components/form-dialog'
import { FormCategory } from '@/features/category/components/form-category'

type Props = {
  id?: string
  isOpen: boolean
  isPending: boolean
  defaultValues: InsertCategoryFormValues
  onDelete?: () => void
  handleClose: () => void
  onSubmit: (values: InsertCategoryFormValues) => void
}

export const FormDialogCategory = ({
  id,
  isOpen,
  isPending,
  defaultValues,
  onDelete,
  handleClose,
  onSubmit,
}: Props) => {
  const formId = 'form-category'

  return (
    <FormDialog
      formId={formId}
      title={id ? 'Editar categoria' : 'Nova categoria'}
      description="Preencha os campos abaixo, e ao finalizar clique em “Salvar”."
      isOpen={isOpen}
      isPending={isPending}
      handleClose={handleClose}
      className="max-w-[90%] md:max-w-3xl"
    >
      <FormCategory
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
