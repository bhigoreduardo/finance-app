import { InsertCategoryFormValues } from '@/features/category/schema'

import { useConfirm } from '@/hooks/use-confirm'
import { useGetCategory } from '@/features/category/api/use-get-category'
import { useEditCategory } from '@/features/category/api/use-edit-category'
import { useOpenCategory } from '@/features/category/hooks/use-open-category'
import { useDeleteCategory } from '@/features/category/api/use-delete-category'

import { FormDialogCategory } from '@/features/category/components/form-dialog-category'

export const FormEditCategory = () => {
  const { id, isOpen, onClose } = useOpenCategory()

  const [ConfirmationDialog, confirm] = useConfirm(
    'Deseja realmente continuar?',
    'Você não poderá reverter a ação depois, perdendo essa informação.',
  )

  const categoryQuery = useGetCategory(id)
  const editMutation = useEditCategory(id)
  const deleteMutation = useDeleteCategory(id)

  const isPending = editMutation.isPending || deleteMutation.isPending

  const { data } = categoryQuery

  if (!data) return null

  const defaultValues: InsertCategoryFormValues = {
    ...data,
  }

  const onSubmit = async (values: InsertCategoryFormValues) => {
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
      <FormDialogCategory
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
