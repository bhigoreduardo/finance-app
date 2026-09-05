import { createContext, useContext } from 'react'

interface ColumnMapping {
  selectedColumns: Record<string, string | null>
  onChange: (columnIndex: number, value: string | null) => void
}

const ColumnMappingContext = createContext<ColumnMapping | undefined>(undefined)

export function ColumnMappingProvider({
  selectedColumns,
  onChange,
  children,
}: ColumnMapping & { children: React.ReactNode }) {
  return (
    <ColumnMappingContext.Provider value={{ selectedColumns, onChange }}>
      {children}
    </ColumnMappingContext.Provider>
  )
}

export const useColumnMapping = () => {
  const context = useContext(ColumnMappingContext)

  if (!context) {
    throw new Error(
      'useColumnMapping deve ser usado dentro de um ColumnMappingProvider',
    )
  }

  return context
}
