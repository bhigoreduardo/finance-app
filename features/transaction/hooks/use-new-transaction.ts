import { create } from 'zustand'

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: [],
}

export type INITIAL_IMPORT = typeof INITIAL_IMPORT_RESULTS

type NewTransactionState = {
  variant: 'TABLE' | 'IMPORT'
  initialImport?: INITIAL_IMPORT
  onChange: (
    variant: 'TABLE' | 'IMPORT',
    initialImport?: INITIAL_IMPORT,
  ) => void

  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useNewTransaction = create<NewTransactionState>((set) => ({
  variant: 'TABLE',
  initialImport: undefined,
  onChange: (variant: 'TABLE' | 'IMPORT', initialImport?: INITIAL_IMPORT) =>
    set({ variant, initialImport }),

  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
