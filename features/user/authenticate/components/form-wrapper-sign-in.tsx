import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import {
  signInDefaultValues,
  SignInFormValues,
} from '@/features/user/authenticate/schema'

import { useSignIn } from '@/features/user/authenticate/api/use-sign-in'
import { useVerifyCaptcha } from '@/features/common/api/use-verify-recaptcha'
import { useCurrentUser } from '@/features/user/authenticate/hooks/use-current-user'

import { FormSignIn } from '@/features/user/authenticate/components/form-sign-in'

export const FormWrapperSignIn = () => {
  const router = useRouter()
  const [redirect, setRedirect] = useState('')
  const [twoFactor, setTwoFactor] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const { update } = useCurrentUser()
  const mutation = useSignIn()
  const verifyRecaptchaMutation = useVerifyCaptcha()
  const isPending = mutation.isPending || verifyRecaptchaMutation.isPending

  const defaultValues: SignInFormValues = { ...signInDefaultValues }

  const onSubmit = (values: SignInFormValues) => {
    verifyRecaptchaMutation.mutate(
      { recaptchaToken: captchaToken },
      {
        onSuccess: () => {
          mutation.mutate(values, {
            onSuccess: (res) => {
              if (res) {
                if ('twoFactor' in res) {
                  setTwoFactor(true)
                }
                if ('redirect' in res) {
                  setRedirect(res.redirect as string)
                  if ('update' in res) {
                    update()
                  }
                }
              }
            },
          })
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

  useEffect(() => {
    if (redirect) {
      router.push(redirect)
    }
  }, [redirect, router])

  return (
    <FormSignIn
      defaultValues={defaultValues}
      twoFactor={twoFactor}
      isPending={isPending}
      onSubmit={onSubmit}
      captchaToken={captchaToken}
      handleCaptcha={handleCaptcha}
    />
  )
}
