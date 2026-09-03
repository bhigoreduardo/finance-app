import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'

export const useGetBilling = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['billings', id],
    queryFn: async () => {
      const response = await client.api['billings'][':id'].$get({
        param: { id },
      })

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.error)
      }

      const { data } = await response.json()
      return { ...data }
    },
  })

  return query
}
