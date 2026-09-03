import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { phoneMask } from '@/lib/format'

import {
  insertUserCompleteSchema,
  InsertUserCompleteFormValues,
} from '@/features/user/schema'

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
  defaultValues: InsertUserCompleteFormValues
  onSubmit: (values: InsertUserCompleteFormValues) => void
}

export const FormSignUpComplete = ({
  isPending,
  defaultValues,
  onSubmit,
}: Props) => {
  const form = useForm<InsertUserCompleteFormValues>({
    resolver: zodResolver(insertUserCompleteSchema),
    defaultValues,
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const handleSubmit = (values: InsertUserCompleteFormValues) => {
    onSubmit(values)
  }

  return (
    <FormWrapper
      title="Completar Cadastro"
      description="Preencha os campos abaixos para terminar seu cadastro."
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-2"
        >
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

          <ButtonLoading className="w-fit" disabled={isPending}>
            Finalizar cadastro
          </ButtonLoading>
        </form>
      </Form>
    </FormWrapper>
  )
}
