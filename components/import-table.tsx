import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { FILTER_OPTIONS_PAGE_SIZE } from '@/constants'

import {
  useColumnMapping,
  ColumnMappingProvider,
} from '@/hooks/use-column-mapping'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { SelectFilter } from '@/components/select-filter'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface ImportTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  maxHeightArea?: string

  actionOptions?: React.ReactNode
}

export function ImportTable<TData, TValue>({
  columns,
  data,
  maxHeightArea,

  actionOptions: ActionOptions,
}: ImportTableProps<TData, TValue>) {
  const [selectedColumns, setSelectedColumns] = useState<
    Record<string, string | null>
  >({})

  const handleColumnMappingChange = (
    columnIndex: number,
    value: string | null,
  ) => {
    setSelectedColumns((prev) => {
      const newSelectedColumns = { ...prev }

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null
        }
      }

      if (value === 'skip') {
        value = null
      }

      newSelectedColumns[`column_${columnIndex}`] = value
      return newSelectedColumns
    })
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <ColumnMappingProvider
      selectedColumns={selectedColumns}
      onChange={handleColumnMappingChange}
    >
      <div className="w-full flex flex-col gap-2 h-full">
        <div className="flex items-center flex-wrap gap-2 justify-between">
          <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap ml-auto">
            {ActionOptions}

            <div className="flex flex-col">
              <Label className="text-xs text-muted-foreground mb-1 ml-1">
                Limite
              </Label>
              <SelectFilter
                placeholder="Selecione limite"
                defaultValue={10}
                value={table.getState().pagination.pageSize}
                data={FILTER_OPTIONS_PAGE_SIZE.map((pageSize) => ({
                  label: pageSize,
                  value: pageSize,
                }))}
                onChange={(value) => {
                  table.setPageSize(value)
                }}
                className="w-full"
              />
            </div>
          </div>
        </div>
        <ScrollArea
          className={cn(
            'rounded-md border overflow-auto max-w-full min-w-full w-60',
            maxHeightArea,
          )}
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Nenhum registro encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </ColumnMappingProvider>
  )
}

const TableHeadSelect = ({
  columnIndex,
  options,
}: {
  columnIndex: number
  options: string[]
}) => {
  const { selectedColumns, onChange } = useColumnMapping()
  const currentSelection = selectedColumns[`column_${columnIndex}`]

  return (
    <Select
      value={currentSelection || ''}
      onValueChange={(value) => onChange(columnIndex, value)}
    >
      <SelectTrigger
        className={cn(
          'focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize',
          currentSelection && 'text-blue-500',
        )}
      >
        <SelectValue placeholder="Pular" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pular">Pular</SelectItem>
        {options.map((option, index) => {
          const disabled =
            Object.values(selectedColumns).includes(option) &&
            selectedColumns[`column_${columnIndex}`] !== option

          return (
            <SelectItem
              value={option}
              key={index}
              disabled={disabled}
              className="capitalize"
            >
              {option}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

export const buildImportColumns = (
  headers: string[],
  options: string[],
): ColumnDef<string[]>[] => {
  return headers.map((_, index) => ({
    id: `column_${index}`,
    header: () => <TableHeadSelect columnIndex={index} options={options} />,
    cell: ({ row }) => row.original[index],
    enableSorting: false,
    enableHiding: false,
  }))
}
