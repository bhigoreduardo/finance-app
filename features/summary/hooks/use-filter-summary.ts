import { create } from 'zustand'

import {
  filterDefaultValues,
  FilterFormValues,
} from '@/features/summary/schema'

type FilterOrderSummaryState = FilterFormValues & {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void

  onChange: (
    updates: Partial<
      Pick<FilterOrderSummaryState, 'to' | 'from' | 'billingId'>
    >,
  ) => void

  onClear: () => void
}

export const useFilterSummary = create<FilterOrderSummaryState>((set) => ({
  ...filterDefaultValues,

  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),

  onChange: (updates) => set((state) => ({ ...state, ...updates })),

  onClear: () => set({ ...filterDefaultValues }),
}))
