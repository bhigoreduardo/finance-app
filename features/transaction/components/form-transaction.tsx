import { Trash2Icon } from 'lucide-react'
import { Resolver, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  InsertTransactionFormValues,
  insertTransactionFormSchema,
} from '@/features/transaction/schema'

import { useCategoryOptions } from '@/features/category/resources/options'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { SelectCreate } from '@/components/select-create'
import { ButtonLoading } from '@/components/button-loading'
import { InputDatePicker } from '@/components/input-date-picker'
import { useBillingOptions } from '@/features/billing/resources/options'
import { InputAmount } from '@/components/input-amount'

type Props = {
  id?: string
  formId?: string
  isPending: boolean
  defaultValues: InsertTransactionFormValues
  onSubmit: (values: InsertTransactionFormValues) => void
  onDelete?: () => void
}

export const FormTransaction = ({
  id,
  formId,
  isPending,
  defaultValues,
  onDelete,
  onSubmit,
}: Props) => {
  const form = useForm<InsertTransactionFormValues>({
    resolver: zodResolver(
      insertTransactionFormSchema,
    ) as Resolver<InsertTransactionFormValues>,
    defaultValues,
    shouldFocusError: true,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const { categoryOptions, isLoadingCategories, onCreateCategory } =
    useCategoryOptions()
  const { billingOptions, isLoadingBillings, onCreateBilling } =
    useBillingOptions()

  const handleSubmit = (values: InsertTransactionFormValues) => {
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
          name="dueDate"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel htmlFor="dueDate">Data de vencimento</FormLabel>
              <FormControl>
                <InputDatePicker
                  id="dueDate"
                  value={field.value || undefined}
                  label="Data do agendamento"
                  onChange={field.onChange}
                  disabled={isPending}
                  enabledTime={true}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field, fieldState }) => (
            <FormItem className="w-full">
              <FormLabel htmlFor="categoryId">Categoria</FormLabel>
              <FormControl>
                <SelectCreate
                  id="categoryId"
                  placeholder="Selecione uma categoria"
                  options={categoryOptions}
                  onCreate={onCreateCategory}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                  isLoading={isLoadingCategories}
                  hasError={!!fieldState.error}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="billingId"
          render={({ field, fieldState }) => (
            <FormItem className="w-full">
              <FormLabel htmlFor="billingId">Conta</FormLabel>
              <FormControl>
                <SelectCreate
                  id="billingId"
                  placeholder="Selecione uma conta"
                  options={billingOptions}
                  onCreate={onCreateBilling}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                  isLoading={isLoadingBillings}
                  hasError={!!fieldState.error}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field, fieldState }) => (
            <FormItem className="w-full">
              <FormLabel htmlFor="amount">Valor</FormLabel>
              <FormControl>
                <InputAmount
                  {...field}
                  id="amount"
                  value={field.value}
                  placeholder="0,00"
                  isPending={isPending}
                  hasError={!!fieldState.error}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ''}
                  placeholder="Descrição opcional da transação"
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
