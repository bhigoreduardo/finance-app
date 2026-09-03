import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'
import { phoneMask } from '@/lib/format'

import { useCurrentUser } from '@/features/user/authenticate/hooks/use-current-user'

export const useGetUserCurrent = () => {
  const { user } = useCurrentUser()

  const query = useQuery({
    enabled: !!user,
    queryKey: ['users/current'],
    queryFn: async () => {
      const response = await client.api['authenticate']['current'].$get()

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.error)
      }

      const { data } = await response.json()
      return { ...data, whatsApp: phoneMask(data.whatsApp) }
    },
  })

  return query
}
