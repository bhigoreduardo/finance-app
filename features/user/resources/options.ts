import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { InsertUserFormValues } from '@/features/user/schema'

export const useNullableFieldsEffect = (
  form: ReturnType<typeof useForm<InsertUserFormValues>>,
  shouldMakeFieldsNullable: boolean,
) => {
  useEffect(() => {
    if (shouldMakeFieldsNullable) {
      form.setValue('password', null)
      form.setValue('repeatPassword', null)
      form.setValue('hasAcceptedTerms', null)
    }
  }, [shouldMakeFieldsNullable, form])
}
