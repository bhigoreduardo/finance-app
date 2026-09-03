import { InferResponseType } from 'hono'
import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'

type ResponseType = InferResponseType<
  (typeof client.api)['billings']['$get'],
  200
>['data'][0]

export type Billing = ResponseType

export const useGetBillings = () => {
  const query = useQuery({
    queryKey: ['billings'],
    queryFn: async () => {
      const response = await client.api['billings'].$get()

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.error)
      }

      const { data } = await response.json()
      return data
    },
  })

  return query
}
