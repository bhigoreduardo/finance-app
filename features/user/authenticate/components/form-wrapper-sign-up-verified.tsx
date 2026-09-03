import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { useSignUpVerified } from '@/features/user/authenticate/api/use-sign-up-verified'

import {
  type ResponseTypeProps,
  FormSignUpVerified,
} from '@/features/user/authenticate/components/form-sign-up-verified'

export const FormWrapperSignUpVerified = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [response, setResponse] = useState<ResponseTypeProps | null>(null)

  const token = searchParams.get('token') ?? undefined

  const mutation = useSignUpVerified(token)
  const isPending = mutation.isPending

  useEffect(() => {
    if (!token) {
      toast.error('Token inválido')
      router.push('/entrar')
      return
    }

    if (hasSubmitted || response) return

    setHasSubmitted(true)

    mutation.mutate(
      { token },
      {
        onSuccess: (res) => {
          if ('success' in res) {
            setResponse({ isError: false, message: res?.success })
          }
        },
        onError: (res) => {
          setResponse({ isError: true, message: res?.message })
        },
      },
    )
  }, [token, router, hasSubmitted, response])

  if (!token) return null

  return <FormSignUpVerified isPending={isPending} response={response} />
}
