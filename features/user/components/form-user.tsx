import { Resolver, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { phoneMask } from '@/lib/format'

import { insertUserSchema, InsertUserFormValues } from '@/features/user/schema'

import { useNullableFieldsEffect } from '@/features/user/resources/options'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

type Props = {
  formId?: string
  isPending: boolean
  isSignUp?: boolean
  isUpdated?: boolean
  isOauth?: boolean
  defaultValues: InsertUserFormValues
  onSubmit: (values: InsertUserFormValues) => void
}

export const FormUser = ({
  formId,
  isPending,
  isSignUp = false,
  isUpdated = false,
  isOauth = false,
  defaultValues,
  onSubmit,
}: Props) => {
  const form = useForm<InsertUserFormValues>({
    resolver: zodResolver(insertUserSchema) as Resolver<InsertUserFormValues>,
    defaultValues,
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const shouldMakeFieldsNullable = !isSignUp && isUpdated
  useNullableFieldsEffect(form, shouldMakeFieldsNullable)

  const handleSubmit = (values: InsertUserFormValues) => {
    onSubmit(values)
  }

  return (
    <Form {...form}>
      <form
        id={formId}
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
                  type="email"
                  placeholder="Informe seu email"
                  disabled={isPending || isOauth}
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
      </form>
    </Form>
  )
}
