import { useNewTransaction } from '@/features/transaction/hooks/use-new-transaction'

import { buildImportColumns, ImportTable } from '@/components/import-table'
import { ActionOptions } from '@/features/transaction/resources/import-options'

export const ImportTransaction = () => {
  const { initialImport } = useNewTransaction()
  console.log({ initialImport })

  if (!initialImport) return null

  const { data } = initialImport

  console.log({ initialImport })

  const headers = data[0]
  const body = data.slice(1)
  const options = ['amount', 'payee', 'date']

  const columns = buildImportColumns(headers, options)

  return (
    <ImportTable
      columns={columns}
      data={data}
      actionOptions={<ActionOptions headers={headers} body={body} />}
    />
  )
}
