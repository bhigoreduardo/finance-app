'use client'

import { cn } from '@/lib/utils'

import { useCurrentUser } from '@/features/user/authenticate/hooks/use-current-user'

export const TitleProtected = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <h1 className={cn('text-xl font-bold', className)}>{children}</h1>
}

export const SubTitleProtected = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <h3 className={cn('text-base text-muted-foreground', className)}>
      {children}
    </h3>
  )
}

export const TitleMessage = ({ children }: { children: React.ReactNode }) => {
  const { user } = useCurrentUser()

  return (
    <div className="flex flex-col gap-2 text-white">
      <h3 className="text-base font-medium">Olá, {user?.name} 👋</h3>
      <p className="text-sm">{children}</p>
    </div>
  )
}

export const TitleDescriptionProtected = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <div className="flex flex-col">
      <span className="font-semibold text-sm">{title}</span>
      <span className="text-muted-foreground text-sm">{description}</span>
    </div>
  )
}
