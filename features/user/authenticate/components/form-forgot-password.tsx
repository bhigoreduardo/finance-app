import { useForm } from 'react-hook-form'
import ReCAPTCHA from 'react-google-recaptcha'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from '@/features/user/authenticate/schema'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FormWrapper } from '@/components/form-wrapper'
import { ButtonLoading } from '@/components/button-loading'

type Props = {
  isPending: boolean
  defaultValues: ForgotPasswordFormValues
  onSubmit: (values: ForgotPasswordFormValues, cb: () => void) => void

  captchaToken: string | null
  handleCaptcha: (token: string | null) => void
}

export const FormForgotPassword = ({
  isPending,
  defaultValues,
  onSubmit,

  captchaToken,
  handleCaptcha,
}: Props) => {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues,
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const handleSubmit = (values: ForgotPasswordFormValues) => {
    onSubmit(values, () => {
      form.reset()
    })
  }

  return (
    <FormWrapper
      title="Recuperar senha"
      description="Informe seu email, enviaremos um link para redefinir sua senha."
      redirectTo="Acessar conta"
      url="/entrar"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Informe seu email"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!captchaToken ? (
            <div className="flex justify-center w-full">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                onChange={handleCaptcha}
              />
            </div>
          ) : (
            <ButtonLoading className="w-fit" disabled={isPending}>
              Recuperar senha
            </ButtonLoading>
          )}
        </form>
      </Form>
    </FormWrapper>
  )
}
