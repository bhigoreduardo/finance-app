import { useForm } from 'react-hook-form'
import ReCAPTCHA from 'react-google-recaptcha'
import { zodResolver } from '@hookform/resolvers/zod'

import { phoneMask } from '@/lib/format'

import { insertUserSchema, InsertUserFormValues } from '@/features/user/schema'

import {
  useOpenPrivacyPolicy,
  useOpenTermOfService,
} from '@/features/common/hooks/use-open-policy'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { FormWrapper } from '@/components/form-wrapper'
import { ButtonLoading } from '@/components/button-loading'

import { FormSecurity } from '@/features/common/components/form-security'
import { FormSocialAuthenticate } from '@/features/user/authenticate/components/form-social-authenticate'

type Props = {
  isPending: boolean
  defaultValues: InsertUserFormValues
  onSubmit: (values: InsertUserFormValues) => void

  captchaToken: string | null
  handleCaptcha: (token: string | null) => void
}

export const FormSignUp = ({
  isPending,
  defaultValues,
  onSubmit,

  captchaToken,
  handleCaptcha,
}: Props) => {
  const { onOpen: onOpenTerm } = useOpenTermOfService()
  const { onOpen: onOpenPrivacy } = useOpenPrivacyPolicy()

  const form = useForm<InsertUserFormValues>({
    resolver: zodResolver(insertUserSchema),
    defaultValues,
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const handleSubmit = (values: InsertUserFormValues) => {
    onSubmit(values)
  }

  return (
    <FormWrapper
      title="Cadastrar"
      description="Cadastre-se para gerar sua landing page."
      redirectTo="Entrar"
      url="/entrar"
    >
      <FormSocialAuthenticate />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Informe seu nome"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ''}
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
            name="whatsApp"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    onChange={({ target: { value } }) =>
                      field.onChange(phoneMask(value))
                    }
                    value={field.value || ''}
                    placeholder="Informe seu WhatsApp"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormSecurity isPending={isPending} isNonGrid />

          <Separator className="my-4" />
          <FormField
            control={form.control}
            name="hasAcceptedTerms"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      disabled={isPending}
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Termos de uso</FormLabel>
                    <FormDescription>
                      Você aceita os{' '}
                      <span
                        className="underline cursor-pointer"
                        onClick={onOpenTerm}
                      >
                        termos
                      </span>{' '}
                      e{' '}
                      <span
                        className="underline cursor-pointer"
                        onClick={onOpenPrivacy}
                      >
                        políticas de privacidade
                      </span>
                      ?
                    </FormDescription>
                  </div>
                </div>
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
              Cadastrar
            </ButtonLoading>
          )}
        </form>
      </Form>
    </FormWrapper>
  )
}
