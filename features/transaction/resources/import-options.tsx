import { format, parse } from 'date-fns'
import { CheckIcon, XIcon } from 'lucide-react'

import { convertAmountToMiliunits } from '@/lib/utils'

import { useIsMobile } from '@/hooks/use-mobile'
import { useColumnMapping } from '@/hooks/use-column-mapping'
import { useNewTransaction } from '@/features/transaction/hooks/use-new-transaction'
import { useBulkCreateTransactions } from '@/features/transaction/api/use-bulk-create-transactions'

import { ButtonLabel } from '@/components/button-label'

const dateFormat = 'yyyy-MM-dd HH:mm:ss'
const outputFormat = 'yyyy-MM-dd'

export const ActionOptions = ({
  headers,
  body,
  options,
}: {
  headers: string[]
  body: string[][]
  options: string[]
}) => {
  const isMobile = useIsMobile()

  const { selectedColumns } = useColumnMapping()
  const { onChange } = useNewTransaction()

  const bulkCreate = useBulkCreateTransactions()

  const progress = Object.values(selectedColumns).filter(Boolean).length

  const onCancel = () => {
    onChange('TABLE', undefined)
  }

  const onContinue = () => {
    const getColumnIndex = (column: string) => column.split('_')[1]

    const mappedHeaders = headers.map((_, index) => {
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
      dueDate: item.dueDate
        ? format(parse(item.dueDate, dateFormat, new Date()), outputFormat)
        : null,
    }))

    bulkCreate.mutate(formattedData, {
      onSuccess: () => onChange('TABLE', undefined),
    })
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <ButtonLabel
        size={isMobile ? 'icon' : 'default'}
        hidden
        label="Cancelar"
        icon={XIcon}
        variant="outline"
        onClick={onCancel}
      >
        {!isMobile && 'Cancelar'}
      </ButtonLabel>
      <ButtonLabel
        size={isMobile ? 'icon' : 'default'}
        // disabled={progress < options.length || bulkCreate.isPending}
        hidden
        label="Continuar"
        icon={CheckIcon}
        onClick={onContinue}
      >
        {!isMobile && `Continuar (${progress} / ${options.length})`}
      </ButtonLabel>
    </div>
  )
}
