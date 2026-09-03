'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMountedState } from 'react-use'

import { useCurrentUser } from '@/features/user/authenticate/hooks/use-current-user'

// import { SheetProvider } from '@/app/(main)/_providers/sheet-provider'
import { DialogProvider } from '@/app/(main)/_providers/dialog-provider'

import { Skeleton } from '@/components/ui/skeleton'

function ProtectedLayoutComponent({
  children,
}: {
  children: React.ReactNode
  params: Promise<{ slug?: string }>
}) {
  const isMounted = useMountedState()

  const router = useRouter()
  const { user, status } = useCurrentUser()

  const redirectTo = '/entrar'

  useEffect(() => {
    if (!user) {
      router.push(redirectTo)
      return
    }
    if (user && !user.whatsApp) router.push('/completar-cadastro')
  }, [user, status, router])

  if (!isMounted) return null

  if (status === 'loading' || !user) {
    return (
      <section className="grid min-h-svh">
        <Skeleton className="h-full w-full" />
      </section>
    )
  }

  return (
    <>
      {/* <SheetProvider /> */}
      <DialogProvider />
      {children}
    </>
  )
}

const ProtectedLayout = dynamic(
  () => Promise.resolve(ProtectedLayoutComponent),
  {
    ssr: false,
  },
)

export default ProtectedLayout
