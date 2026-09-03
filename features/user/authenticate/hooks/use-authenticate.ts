import { create } from 'zustand'

type OpenAuthenticateAccountState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useOpenAuthenticateAccount = create<OpenAuthenticateAccountState>(
  (set) => ({
    isOpen: false,

    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  }),
)

type OpenAuthenticatePasswordState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useOpenAuthenticatePassword =
  create<OpenAuthenticatePasswordState>((set) => ({
    isOpen: false,

    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  }))
