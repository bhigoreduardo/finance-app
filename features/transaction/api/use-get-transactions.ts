import { InferResponseType } from 'hono'
import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'
import { convertAmountFromMiliunits } from '@/lib/utils'

type ResponseType = InferResponseType<
  (typeof client.api)['transactions']['$get'],
  200
>['data'][0]

export type Transaction = ResponseType

export const useGetTransactions = () => {
  const query = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await client.api['transactions'].$get()

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.error)
      }

      const { data } = await response.json()
      return data.map((transaction) => ({
        ...transaction,
        amount: convertAmountFromMiliunits(transaction.amount),
      }))
    },
  })

  return query
}
