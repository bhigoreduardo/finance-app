import { useState } from 'react'

import {
  forgotPasswordDefaultValues,
  ForgotPasswordFormValues,
} from '@/features/user/authenticate/schema'

import { useVerifyCaptcha } from '@/features/common/api/use-verify-recaptcha'
import { useForgotPassword } from '@/features/user/authenticate/api/use-forgot-password'

import { FormForgotPassword } from '@/features/user/authenticate/components/form-forgot-password'

export const FormWrapperForgotPassword = () => {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const mutation = useForgotPassword()
  const verifyRecaptchaMutation = useVerifyCaptcha()
  const isPending = mutation.isPending || verifyRecaptchaMutation.isPending

  const defaultValues: ForgotPasswordFormValues = {
    ...forgotPasswordDefaultValues,
  }

  const onSubmit = (values: ForgotPasswordFormValues, cb: () => void) => {
    verifyRecaptchaMutation.mutate(
      { recaptchaToken: captchaToken },
      {
        onSuccess: () => {
          mutation.mutate(values, {
            onSuccess: cb,
            onError: cb,
          })
        },
        onError: () => {
          setCaptchaToken(null)
          cb()
        },
      },
    )
  }

  const handleCaptcha = (token: string | null) => {
    setCaptchaToken(token)
  }

  return (
    <FormForgotPassword
      isPending={isPending}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      captchaToken={captchaToken}
      handleCaptcha={handleCaptcha}
    />
  )
}
