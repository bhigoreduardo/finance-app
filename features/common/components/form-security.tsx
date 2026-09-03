import { useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils'

import { InsertUserFormValues } from '@/features/user/schema'
import { ResetPasswordFormValues as ResetUserPasswordFormValues } from '@/features/user/authenticate/schema'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { InputPassword } from '@/components/input-password'
import { ProgressPassword } from '@/components/progress-custom'

type AllowedForm = InsertUserFormValues | ResetUserPasswordFormValues

type Props = { isPending: boolean; isNonGrid?: boolean }

export const FormSecurity = ({ isPending, isNonGrid = false }: Props) => {
  const form = useFormContext<AllowedForm>()

  const watchPassword = form.watch('password')

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          'grid sm:grid-cols-2 gap-2',
          isNonGrid && 'sm:grid-cols-1',
        )}
      >
        <div className="flex flex-col gap-1 w-full">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <InputPassword
                    {...field}
                    value={field.value || ''}
                    placeholder="Informe sua senha"
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
                  value={field.value || ''}
                  placeholder="Repita sua senha"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
