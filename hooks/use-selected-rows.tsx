import { Row } from '@tanstack/react-table'
import { createContext, useContext } from 'react'

interface SelectedRows<TData> {
  selectedRows: Row<TData>[]
  reset: () => void
}

const SelectedRowsContext = createContext<SelectedRows<any> | undefined>(
  undefined,
)

export function SelectedRowsProvider<TData>({
  selectedRows,
  reset,
  children,
}: SelectedRows<TData> & {
  children: React.ReactNode
}) {
  return (
    <SelectedRowsContext.Provider value={{ selectedRows, reset }}>
      {children}
    </SelectedRowsContext.Provider>
  )
}

export const useSelectedRows = <TData,>() => {
  return useContext(SelectedRowsContext) as SelectedRows<TData>
}
