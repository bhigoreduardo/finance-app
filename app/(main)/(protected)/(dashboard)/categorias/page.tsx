'use client'

import { useGetCategories } from '@/features/category/api/use-get-categories'

import {
  TitleProtected as Title,
  SubTitleProtected as SubTitle,
} from '@/components/title-custom'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTableLoading } from '@/components/data-table'
import { TableCategory } from '@/features/category/components/table-category'

export default function CategoryPage() {
  const categoriesQuery = useGetCategories()
  const categories = categoriesQuery.data || []

  const isLoading = categoriesQuery.isLoading

  if (isLoading) {
    return (
      <section>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7.5 max-w-75" />
            <Skeleton className="h-7.5 max-w-150" />
          </div>
          <DataTableLoading />
        </div>
      </section>
    )
  }

  console.log({ categories })

  return (
    <section>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Title>Categorias</Title>
          <SubTitle>Gerenciar as categorias de receitas e despesas</SubTitle>
        </div>
        <TableCategory data={categories} />
      </div>
    </section>
  )
}
