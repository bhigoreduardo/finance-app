import { columns } from '@/features/billing/resources/columns'

import { type Billing } from '@/features/billing/api/use-get-billings'

import {
  ActionOptions,
  SelectedOptions,
} from '@/features/billing/resources/table-options'
import { DataTable } from '@/components/data-table'

type Props = {
  data: Billing[]
}

export const TableBilling = ({ data }: Props) => {
  return (
    <DataTable
      columns={columns}
      data={data}
      filterKey="name"
      placeholder="conta"
      selectedOptions={<SelectedOptions />}
      actionOptions={<ActionOptions />}
    />
  )
}
