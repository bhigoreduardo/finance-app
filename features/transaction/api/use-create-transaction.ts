import { toast } from 'sonner'
import { InferResponseType, InferRequestType } from 'hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { client } from '@/lib/hono'

type ResponseType = InferResponseType<
  (typeof client.api)['transactions']['$post']
>

type RequestType = InferRequestType<
  (typeof client.api)['transactions']['$post']
>['json']

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<
    ResponseType,
    { message: string; status: number },
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api['transactions'].$post({ json })

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
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return mutation
}
