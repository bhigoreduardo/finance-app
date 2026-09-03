import {
  insertCategoryDefaultValues,
  InsertCategoryFormValues,
} from '@/features/category/schema'

import { useNewCategory } from '@/features/category/hooks/use-new-category'
import { useCreateCategory } from '@/features/category/api/use-create-category'

import { FormDialogCategory } from '@/features/category/components/form-dialog-category'

export const FormNewCategory = () => {
  const { isOpen, onClose } = useNewCategory()

  const mutation = useCreateCategory()
  const isPending = mutation.isPending

  const defaultValues: InsertCategoryFormValues = {
    ...insertCategoryDefaultValues,
  }

  const onSubmit = async (values: InsertCategoryFormValues) => {
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
    <FormDialogCategory
      isOpen={isOpen}
      isPending={isPending}
      defaultValues={defaultValues}
      handleClose={onClose}
      onSubmit={onSubmit}
    />
  )
}
