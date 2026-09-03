import { useUpdate2fa } from '@/features/user/authenticate/api/use-update-2fa'
import { useGetUserCurrent } from '@/features/user/authenticate/api/use-get-user-current'

import { FormUpdate2FA } from '@/features/user/authenticate/components/form-update-2fa'

export const FormWrapperUpdate2fa = () => {
  const userQuery = useGetUserCurrent()

  const mutation = useUpdate2fa()
  const isPending = mutation.isPending

  const { data } = userQuery

  if (!data) return null

  const onSubmit = () => mutation.mutate({})

  return (
    <FormUpdate2FA
      isPending={isPending}
      isTwoFactorEnabled={data.isTwoFactorEnabled}
      onSubmit={onSubmit}
    />
  )
}
