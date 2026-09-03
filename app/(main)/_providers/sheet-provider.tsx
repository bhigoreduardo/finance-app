'use client'

import { useMountedState } from 'react-use'

import { FormNewTransaction } from '@/features/transaction/components/form-new-transaction'
import { FormEditTransaction } from '@/features/transaction/components/form-edit-transaction'

export const SheetProvider = () => {
  const isMounted = useMountedState()

  if (!isMounted) return null

  return (
    <>
      <FormNewTransaction />
      <FormEditTransaction />
    </>
  )
}
