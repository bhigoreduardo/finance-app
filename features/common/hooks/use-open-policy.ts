import { create } from 'zustand'

type OpenPrivacyPolicyState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useOpenPrivacyPolicy = create<OpenPrivacyPolicyState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

type OpenTermOfServiceState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useOpenTermOfService = create<OpenTermOfServiceState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
