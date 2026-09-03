import { useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  insertUserDefaultValues,
  InsertUserFormValues,
} from '@/features/user/schema'

import { useSignUp } from '@/features/user/authenticate/api/use-sign-up'
import { useVerifyCaptcha } from '@/features/common/api/use-verify-recaptcha'

import { FormSignUp } from '@/features/user/authenticate/components/form-sign-up'

export const FormWrapperSignUp = () => {
  const router = useRouter()
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const mutation = useSignUp()
  const verifyRecaptchaMutation = useVerifyCaptcha()
  const isPending = mutation.isPending || verifyRecaptchaMutation.isPending

  const defaultValues: InsertUserFormValues = {
    ...insertUserDefaultValues,
  }

  const onSubmit = (values: InsertUserFormValues) => {
    verifyRecaptchaMutation.mutate(
      { recaptchaToken: captchaToken },
      {
        onSuccess: () => {
          mutation.mutate(
            { ...values },
            {
              onSuccess: async () => {
                router.push(`/entrar`)
              },
            },
          )
        },
        onError: () => {
          setCaptchaToken(null)
        },
      },
    )
  }

  const handleCaptcha = (token: string | null) => {
    setCaptchaToken(token)
  }

  return (
    <FormSignUp
      defaultValues={defaultValues}
      isPending={isPending}
      onSubmit={onSubmit}
      captchaToken={captchaToken}
      handleCaptcha={handleCaptcha}
    />
  )
}
