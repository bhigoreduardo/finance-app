import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/lib/utils'

import {
  UpdatePasswordFormValues,
  updatePasswordSchema,
} from '@/features/common/schema'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { InputPassword } from '@/components/input-password'
import { ProgressPassword } from '@/components/progress-custom'

type Props = {
  formId?: string
  isPending: boolean
  isNonColumn?: boolean
  defaultValues: UpdatePasswordFormValues
  onSubmit: (values: UpdatePasswordFormValues) => void
}

export const FormUpdatePassword = ({
  formId,
  isPending,
  isNonColumn = true,
  defaultValues,
  onSubmit,
}: Props) => {
  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues,
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })
  const watchPassword = form.watch('newPassword')

  const handleSubmit = (values: UpdatePasswordFormValues) => {
    onSubmit(values)
    form.reset()
  }
  // console.log(form.formState.errors)

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-2"
      >
        <div
          className={cn(
            'grid items-center gap-2',
            isNonColumn && 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
          )}
        >
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
          <div className="flex flex-col gap-1 w-full">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <InputPassword
                      {...field}
                      placeholder="Nova senha"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {watchPassword && <ProgressPassword password={watchPassword} />}
          </div>
          <FormField
            control={form.control}
            name="repeatPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Repetir senha</FormLabel>
                <FormControl>
                  <InputPassword
                    {...field}
                    placeholder="Repita nova senha"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}
