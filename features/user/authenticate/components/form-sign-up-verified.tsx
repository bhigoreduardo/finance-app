import { Loader2Icon, TriangleAlertIcon, BadgeCheckIcon } from 'lucide-react'

import { FormWrapper } from '@/components/form-wrapper'

export type ResponseTypeProps = {
  isError: boolean
  message: string | null
}

const FormMessage = ({ isError, message }: ResponseTypeProps) => {
  if (!message) return null

  if (!isError)
    return (
      <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
        <BadgeCheckIcon className="size-4" />
        <p>{message}</p>
      </div>
    )

  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      <TriangleAlertIcon className="size-4" />
      <p>{message}</p>
    </div>
  )
}

type Props = {
  isPending: boolean
  response: ResponseTypeProps | null
}

export const FormSignUpVerified = ({ isPending, response }: Props) => {
  return (
    <FormWrapper
      title="Confirmar sua conta"
      description={
        isPending
          ? 'Aguarde enquanto verificamos sua conta'
          : 'Verificação finalizada'
      }
      redirectTo="Acesse sua conta"
      url="/entrar"
    >
      <div className="flex items-center w-full justify-center">
        {!response && (
          <Loader2Icon className="animate-spin size-4 text-slate-300" />
        )}
        {response && <FormMessage {...response} />}
      </div>
    </FormWrapper>
  )
}
