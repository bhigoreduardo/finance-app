import { useNewTransaction } from '@/features/transaction/hooks/use-new-transaction'

import { buildImportColumns, ImportTable } from '@/components/import-table'
import { ActionOptions } from '@/features/transaction/resources/import-options'

export const ImportTransaction = () => {
  const { initialImport } = useNewTransaction()

  if (!initialImport) return null

  const { data } = initialImport

  const headers = data[0]
  const body = data.slice(1)
  const options = ['amount', 'description', 'dueDate']

  const columns = buildImportColumns(headers, options)

  return (
    <ImportTable
      columns={columns}
      data={body}
      actionOptions={
        <ActionOptions headers={headers} body={body} options={options} />
      }
    />
  )
}
