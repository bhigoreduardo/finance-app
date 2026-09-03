import { Trash2Icon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  insertBillingSchema,
  InsertBillingFormValues,
} from '@/features/billing/schema'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ButtonLoading } from '@/components/button-loading'

type Props = {
  id?: string
  formId?: string
  isPending: boolean
  defaultValues: InsertBillingFormValues
  onSubmit: (values: InsertBillingFormValues) => void
  onDelete?: () => void
}

export const FormBilling = ({
  id,
  formId,
  isPending,
  defaultValues,
  onDelete,
  onSubmit,
}: Props) => {
  const form = useForm<InsertBillingFormValues>({
    resolver: zodResolver(insertBillingSchema),
    defaultValues,
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const handleSubmit = (values: InsertBillingFormValues) => {
    onSubmit(values)
  }

  const handleDelete = () => {
    onDelete?.()
  }

  return (
    <Form {...form}>
      <form
        id={formId}
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {id && (
          <div className="flex items-center sm:justify-end gap-2">
            <ButtonLoading
              type="button"
              disabled={isPending}
              onClick={handleDelete}
              className="sm:w-fit w-full"
              variant="destructive"
            >
              <Trash2Icon className="size-4" />
              Excluir
            </ButtonLoading>
          </div>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="Nome da conta, ex: Dinheiro, Cartão de crédito, etc..."
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
