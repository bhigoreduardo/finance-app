import { useGetBillings } from '@/features/billing/api/use-get-billings'
import { useCreateBilling } from '@/features/billing/api/use-create-billing'

export const useBillingOptions = () => {
  const mutation = useCreateBilling()
  const billingsQuery = useGetBillings()

  const billingOptions: FilterOptionsProps = (billingsQuery.data ?? []).map(
    (billing) => ({
      label: billing.name,
      value: billing.id,
    }),
  )
  const isLoadingBillings = billingsQuery.isLoading

  const onCreateBilling = (name: string) => mutation.mutate({ name })

  return {
    billingOptions,
    isLoadingBillings,
    onCreateBilling,
  }
}
