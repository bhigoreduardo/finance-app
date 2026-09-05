import {
  ColumnDef,
  flexRender,
  SortingState,
  useReactTable,
  getCoreRowModel,
  VisibilityState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table'
import { useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import { FILTER_OPTIONS_PAGE_SIZE } from '@/constants'

import { SelectedRowsProvider } from '@/hooks/use-selected-rows'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SelectFilter } from '@/components/select-filter'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterKey: string
  placeholder: string
  maxHeightArea?: string

  selectedOptions?: React.ReactNode
  actionOptions?: React.ReactNode

  isNonViewSearch?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  placeholder,
  maxHeightArea,

  selectedOptions: SelectedOptions,
  actionOptions: ActionOptions,

  isNonViewSearch = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const reset = () => {
    table.resetRowSelection()
  }

  return (
    <SelectedRowsProvider<TData> selectedRows={selectedRows} reset={reset}>
      <div className="w-full flex flex-col gap-2 h-full">
        <div className="flex items-center flex-wrap gap-2 justify-between">
          {!isNonViewSearch && (
            <div className="flex flex-col lg:max-w-md grow">
              <Label className="text-xs text-muted-foreground mb-1 ml-1">
                Pesquisar
              </Label>
              <Input
                placeholder={`Filtrar por ${placeholder}`}
                value={
                  (table.getColumn(filterKey)?.getFilterValue() as string) ?? ''
                }
                onChange={(event) =>
                  table.getColumn(filterKey)?.setFilterValue(event.target.value)
                }
                className="lg:max-w-md w-full"
              />
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap ml-auto">
            {SelectedOptions}
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

            {table.getAllColumns().length > 3 && (
              <div className="flex flex-col">
                <Label className="text-xs text-muted-foreground mb-1 ml-1">
                  Colunas
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="w-full lg:w-fit">
                    <Button
                      variant="outline"
                      className="flex items-center justify-between"
                    >
                      Colunas <ChevronDownIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize cursor-pointer"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                        )
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
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

        <div className="flex sm:flex-row mt-auto flex-col sm:items-center justify-end gap-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de{' '}
            {table.getFilteredRowModel().rows.length} registro(s)
            selecionado(s).
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Voltar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Avançar
            </Button>
          </div>
        </div>
      </div>
    </SelectedRowsProvider>
  )
}

export const DataTableLoading = () => {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center flex-wrap gap-2 justify-between">
        <Skeleton className="h-9 w-100 lg:max-w-sm" />
        <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap w-full lg:w-fit">
          <Skeleton className="h-9 w-32.5" />
          <Skeleton className="h-9 w-32.5" />
          <Skeleton className="h-9 w-32.5" />
        </div>
      </div>
      <Skeleton className="h-75 w-full" />
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Skeleton className="h-5 w-50" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-7.5 w-37.5" />
          <Skeleton className="h-7.5 w-37.5" />
        </div>
      </div>
    </div>
  )
}
