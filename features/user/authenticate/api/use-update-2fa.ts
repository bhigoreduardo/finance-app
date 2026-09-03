import { toast } from 'sonner'
import { InferRequestType, InferResponseType } from 'hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { client } from '@/lib/hono'

type ResponseType = InferResponseType<
  (typeof client.api.authenticate)['update-2fa']['$patch']
>

type RequestType = InferRequestType<
  (typeof client.api.authenticate)['update-2fa']['$patch']
>

export const useUpdate2fa = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<
    ResponseType,
    { message: string; status: number },
    RequestType
  >({
    mutationFn: async () => {
      const response = await client.api.authenticate['update-2fa']['$patch']()

      if (!response.ok) {
        const data = await response.json()

        throw {
          message: data.error,
          status: response.status,
        }
      }

      return await response.json()
    },
    onSuccess: (res) => {
      if ('success' in res) {
        toast.success(res.success)
      }
      queryClient.invalidateQueries({ queryKey: ['users/current'] })
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return mutation
}
