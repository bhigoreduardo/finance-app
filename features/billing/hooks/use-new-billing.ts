import { create } from 'zustand'

type NewBillingState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useNewBilling = create<NewBillingState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
