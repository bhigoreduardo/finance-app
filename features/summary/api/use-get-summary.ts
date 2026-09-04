import { InferResponseType } from 'hono'
import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'
import { convertAmountFromMiliunits } from '@/lib/utils'

import { useFilterSummary } from '@/features/summary/hooks/use-filter-summary'

type ResponseType = InferResponseType<
  (typeof client.api)['summaries']['$get'],
  200
>['data']

export type Summary = ResponseType

export const useGetSummary = () => {
  const { from, to, billingId } = useFilterSummary()

  const query = useQuery({
    queryKey: ['summaries', from, to, billingId],
    queryFn: async () => {
      const response = await client.api['summaries']['$get']({
        query: { from, to, billingId },
      })

      if (!response.ok) {
        const data = await response.json()

        throw new Error('data.error')
      }

      const { data } = await response.json()

      return {
        ...data,
        remainingAmount: convertAmountFromMiliunits(data.remainingAmount),
        incomeAmount: convertAmountFromMiliunits(data.incomeAmount),
        expensesAmount: convertAmountFromMiliunits(data.expensesAmount),
        categories: data.categories.map((category) => ({
          ...category,
          value: convertAmountFromMiliunits(category.value),
        })),
        days: data.days.map((day) => ({
          ...day,
          income: convertAmountFromMiliunits(Number(day.income)),
          expenses: convertAmountFromMiliunits(Number(day.expenses)),
        })),
      }
    },
    // refetchInterval: 5 * 1000, // TODO: Create webhook ou talvez criar um observador q fica vendo um status por exemplo de notificação, ai quando ele alterar ele revalida
    // refetchIntervalInBackground: true,
    // refetchOnWindowFocus: true,
  })

  return query
}
