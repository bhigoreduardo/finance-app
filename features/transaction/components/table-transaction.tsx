import { columns } from '@/features/transaction/resources/columns'

import { type Transaction } from '@/features/transaction/api/use-get-transactions'

import {
  ActionOptions,
  SelectedOptions,
} from '@/features/transaction/resources/table-options'
import { DataTable } from '@/components/data-table'

type Props = {
  data: Transaction[]
}

export const TableTransaction = ({ data }: Props) => {
  return (
    <DataTable
      columns={columns}
      data={data}
      filterKey="name"
      placeholder="transação"
      selectedOptions={<SelectedOptions />}
      actionOptions={<ActionOptions />}
      isNonViewSearch
    />
  )
}
