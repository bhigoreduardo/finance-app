import { useGetCategories } from '@/features/category/api/use-get-categories'
import { useCreateCategory } from '@/features/category/api/use-create-category'

export const useCategoryOptions = () => {
  const mutation = useCreateCategory()
  const categoriesQuery = useGetCategories()

  const categoryOptions: FilterOptionsProps = (categoriesQuery.data ?? []).map(
    (category) => ({
      label: category.name,
      value: category.id,
    }),
  )
  const isLoadingCategories = categoriesQuery.isLoading

  const onCreateCategory = (name: string) => mutation.mutate({ name })

  return {
    categoryOptions,
    isLoadingCategories,
    onCreateCategory,
  }
}
