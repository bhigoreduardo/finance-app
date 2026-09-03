import { columns } from '@/features/category/resources/columns'

import { type Category } from '@/features/category/api/use-get-categories'

import {
  ActionOptions,
  SelectedOptions,
} from '@/features/category/resources/table-options'
import { DataTable } from '@/components/data-table'

type Props = {
  data: Category[]
}

export const TableCategory = ({ data }: Props) => {
  return (
    <DataTable
      columns={columns}
      data={data}
      filterKey="name"
      placeholder="categoria"
      selectedOptions={<SelectedOptions />}
      actionOptions={<ActionOptions />}
    />
  )
}
