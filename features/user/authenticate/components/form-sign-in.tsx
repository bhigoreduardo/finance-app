import Link from 'next/link'
import { useForm } from 'react-hook-form'
import ReCAPTCHA from 'react-google-recaptcha'
import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/lib/utils'

import {
  SignInFormValues,
  signInSchema,
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
import { InputPassword } from '@/components/input-password'
import { ButtonLoading } from '@/components/button-loading'

import { FormSocialAuthenticate } from '@/features/user/authenticate/components/form-social-authenticate'

type Props = {
  twoFactor: boolean
  isPending: boolean
  defaultValues: SignInFormValues
  onSubmit: (values: SignInFormValues) => void

  captchaToken: string | null
  handleCaptcha: (token: string | null) => void
}

export const FormSignIn = ({
  twoFactor,
  isPending,
  defaultValues,
  onSubmit,

  captchaToken,
  handleCaptcha,
}: Props) => {
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues,
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const handleSubmit = (values: SignInFormValues) => {
    onSubmit(values)
  }

  return (
    <FormWrapper
      title="Entrar"
      description={`Digite seu ${
        twoFactor ? 'código' : 'e-mail e senha'
      } abaixo para acessar em sua conta`}
      redirectTo="Cadastrar"
      url="/cadastrar"
    >
      <div className={cn(!twoFactor ? '' : 'hidden')}>
        <FormSocialAuthenticate />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-2"
        >
          <div className={cn(twoFactor ? '' : 'hidden')}>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder="Informe seu código"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div
            className={cn('flex flex-col gap-2', !twoFactor ? '' : 'hidden')}
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <InputPassword
                      {...field}
                      placeholder="Informe sua senha"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Link
              href="/recuperar-senha"
              className="w-full text-end inline-block text-sm underline-offset-4 hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>

          {!captchaToken ? (
            <div className="flex justify-center w-full">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                onChange={handleCaptcha}
              />
            </div>
          ) : (
            <ButtonLoading className="w-fit" disabled={isPending}>
              Entrar
            </ButtonLoading>
          )}
        </form>
      </Form>
    </FormWrapper>
  )
}
