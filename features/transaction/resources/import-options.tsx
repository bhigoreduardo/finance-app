import { format, parse } from 'date-fns'
import { CheckIcon, XIcon } from 'lucide-react'

import { convertAmountToMiliunits } from '@/lib/utils'

import { useColumnMapping } from '@/hooks/use-column-mapping'
import { useNewTransaction } from '@/features/transaction/hooks/use-new-transaction'
// import { useBulkCreateTransactions } from '@/features/transaction/api/use-bulk-create-transactions'

import { Button } from '@/components/ui/button'

const dateFormat = 'yyyy-MM-dd HH:mm:ss'
const outputFormat = 'yyyy-MM-dd'

const requiredOptions = ['amount', 'date', 'payee']

export const ActionOptions = ({
  headers,
  body,
}: {
  headers: string[]
  body: string[][]
}) => {
  const { selectedColumns } = useColumnMapping()
  const { onChange } = useNewTransaction()

  // const bulkCreate = useBulkCreateTransactions()

  const progress = Object.values(selectedColumns).filter(Boolean).length

  const handleCancel = () => {
    onChange('TABLE', undefined)
  }

  const handleContinue = () => {
    const getColumnIndex = (column: string) => column.split('_')[1]

    const mappedHeaders = headers.map((_header, index) => {
      const columnIndex = getColumnIndex(`column_${index}`)
      return selectedColumns[`column_${columnIndex}`] || null
    })

    const mappedBody = body
      .map((row) =>
        row.map((cell, index) => {
          const columnIndex = getColumnIndex(`column_${index}`)
          return selectedColumns[`column_${columnIndex}`] ? cell : null
        }),
      )
      .filter((row) => row.some((cell) => cell !== null))

    const arrayOfData = mappedBody.map((row) =>
      row.reduce((acc: Record<string, string>, cell, index) => {
        const header = mappedHeaders[index]
        if (header !== null && cell !== null) {
          acc[header] = cell
        }
        return acc
      }, {}),
    )

    const formattedData = arrayOfData.map((item) => ({
      ...item,
      amount: convertAmountToMiliunits(parseFloat(item.amount)),
      date: format(parse(item.date, dateFormat, new Date()), outputFormat),
    }))
    console.log({ formattedData })

    // bulkCreate.mutate(
    //   { transactions: formattedData },
    //   { onSuccess: () => onChange('TABLE', undefined) },
    // )
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={handleCancel}>
        <XIcon className="size-4" />
        Cancelar
      </Button>
      <Button
        // disabled={progress < requiredOptions.length || bulkCreate.isPending}
        onClick={handleContinue}
      >
        <CheckIcon className="size-4" />
        Continuar ({progress} / {requiredOptions.length})
      </Button>
    </div>
  )
}
