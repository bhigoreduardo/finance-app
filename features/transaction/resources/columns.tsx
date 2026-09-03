import { format } from 'date-fns'
import { ArrowUpDownIcon, TriangleAlertIcon } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

import { cn, formatCurrency } from '@/lib/utils'

import { type Transaction } from '@/features/transaction/api/use-get-transactions'

import { useOpenBilling } from '@/features/billing/hooks/use-open-billing'
import { useOpenCategory } from '@/features/category/hooks/use-open-category'
import { useOpenTransaction } from '@/features/transaction/hooks/use-open-transaction'

import { Actions } from '@/features/transaction/resources/actions'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

const CategorizedColumn = ({
  type,
  id,
  name,
  onClick,
}: {
  type: 'category' | 'billing'
  id: string | null
  name: string | null
  onClick?: () => void
}) => {
  return (
    <div
      className={cn(
        'flex items-center cursor-pointer hover:underline',
        !id && 'text-red-500',
      )}
      onClick={onClick}
    >
      {!id && <TriangleAlertIcon className="size-4 mr-2 shrink-0" />}
      {name ? name : 'Sem ' + (type === 'category' ? 'categoria' : 'conta')}
    </div>
  )
}

export const columns: ColumnDef<Transaction>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (row) => row.dueDate,
    accessorKey: 'dueDate',
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Data de Vencimento
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      )
    },
    cell: ({ row }) =>
      row.original.dueDate
        ? format(row.original.dueDate, "dd/MM/yyyy HH:mm'h'")
        : '-',
  },
  {
    accessorFn: (row) => row.category?.name,
    accessorKey: 'categoria',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Categoria
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const { onOpen: onOpenCategory } = useOpenCategory()
      const { onOpen: onOpenTransaction } = useOpenTransaction()

      return (
        <CategorizedColumn
          id={row.original.categoryId}
          name={row.original.category?.name || null}
          type="category"
          onClick={() =>
            row.original.categoryId
              ? onOpenCategory(row.original.categoryId)
              : onOpenTransaction(row.original.id)
          }
        />
      )
    },
  },
  {
    accessorFn: (row) => row.billing?.name,
    accessorKey: 'conta',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Conta
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const { onOpen: onOpenBilling } = useOpenBilling()
      const { onOpen: onOpenTransaction } = useOpenTransaction()

      return (
        <CategorizedColumn
          id={row.original.billingId}
          name={row.original.billing?.name || null}
          type="billing"
          onClick={() =>
            row.original.billingId
              ? onOpenBilling(row.original.billingId)
              : onOpenTransaction(row.original.id)
          }
        />
      )
    },
  },
  {
    accessorFn: (row) => row.amount,
    accessorKey: 'valor',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Valor
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      )
    },
    cell: ({ row }) => formatCurrency(row.original.amount),
  },
  {
    id: 'actions',
    header: () => {
      return <Button variant="ghost">Ações</Button>
    },
    enableHiding: false,
    cell: ({ row }) => <Actions id={row.original.id} />,
  },
]
