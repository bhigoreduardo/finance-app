import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CircleCheckIcon, CircleXIcon } from 'lucide-react'

import { useBillingOptions } from '@/features/billing/resources/options'
import { useCategoryOptions } from '@/features/category/resources/options'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { SelectCreate } from '@/components/select-create'

type TransactionExtraFields = {
  categoryId?: string
  billingId?: string
}

export const useTransaction = (): [
  () => React.JSX.Element,
  () => Promise<TransactionExtraFields | false>,
] => {
  const [promise, setPromise] = useState<{
    resolve: (value: TransactionExtraFields | false) => void
  } | null>(null)

  const form = useForm<TransactionExtraFields>({
    defaultValues: {
      categoryId: undefined,
      billingId: undefined,
    },
  })

  const { categoryOptions, isLoadingCategories, onCreateCategory } =
    useCategoryOptions()
  const { billingOptions, isLoadingBillings, onCreateBilling } =
    useBillingOptions()

  const confirm = () =>
    new Promise<TransactionExtraFields | false>((resolve) => {
      setPromise({ resolve })
    })

  const handleClose = () => {
    setPromise(null)
  }

  const handleCancel = () => {
    promise?.resolve(false)
    handleClose()
  }

  const handleConfirm = () => {
    promise?.resolve(form.getValues())
    handleClose()
  }

  const ConfirmationDialog = () => (
    <Dialog onOpenChange={handleClose} open={promise !== null}>
      <DialogContent className="z-1000">
        <DialogHeader>
          <DialogTitle>Selecione os demais campos</DialogTitle>
          <DialogDescription>
            Preencha as demais informações da transação (opcional)
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
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
                    // disabled={isPending}
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
                    // disabled={isPending}
                    isLoading={isLoadingBillings}
                    hasError={!!fieldState.error}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
        <DialogFooter className="pt-2">
          <Button onClick={handleCancel} variant="destructive">
            <CircleXIcon className="size-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            <CircleCheckIcon className="size-4 mr-2" />
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return [ConfirmationDialog, confirm]
}
