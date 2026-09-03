import { ArrowUpDownIcon } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

import { type Category } from '@/features/category/api/use-get-categories'

import { Actions } from '@/features/category/resources/actions'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export const columns: ColumnDef<Category>[] = [
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
    accessorFn: (row) => row.name,
    accessorKey: 'name',
    enableHiding: false,
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
