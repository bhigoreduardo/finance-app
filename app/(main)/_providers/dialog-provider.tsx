'use client'

import { useMountedState } from 'react-use'

import { FormDialogAuthenticateAccount } from '@/features/user/authenticate/components/form-dialog-authenticate-account'
import { FormDialogAuthenticatePassword } from '@/features/user/authenticate/components/form-dialog-authenticate-password'

import { FormNewCategory } from '@/features/category/components/form-new-category'
import { FormEditCategory } from '@/features/category/components/form-edit-category'

export const DialogProvider = () => {
  const isMounted = useMountedState()

  if (!isMounted) return null

  return (
    <>
      <FormDialogAuthenticateAccount />
      <FormDialogAuthenticatePassword />

      <FormNewCategory />
      <FormEditCategory />
    </>
  )
}
