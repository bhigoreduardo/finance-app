'use client'

import { useMountedState } from 'react-use'

import { FormDialogAuthenticateAccount } from '@/features/user/authenticate/components/form-dialog-authenticate-account'
import { FormDialogAuthenticatePassword } from '@/features/user/authenticate/components/form-dialog-authenticate-password'

export const DialogProvider = () => {
  const isMounted = useMountedState()

  if (!isMounted) return null

  return (
    <>
      <FormDialogAuthenticateAccount />
      <FormDialogAuthenticatePassword />
    </>
  )
}
