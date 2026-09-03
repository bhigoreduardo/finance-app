import Link from 'next/link'

import { cn } from '@/lib/utils'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Props = {
  title: string
  description: string
  redirectTo?: string
  url?: string
  handleClick?: () => void
  children: React.ReactNode
  className?: string
}

export const FormWrapper = ({
  title,
  description,
  redirectTo,
  url,
  handleClick,
  children,
  className,
}: Props) => {
  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      <CardHeader className="flex gap-2 sm:flex-row flex-col">
        <div className="flex flex-col gap-2">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {redirectTo && (
          <CardAction className="ml-auto">
            <Button
              variant="link"
              className="underline underline-offset-4 text-accent-foreground"
              onClick={handleClick}
            >
              {url ? (
                <Link href={url}>{redirectTo}</Link>
              ) : (
                <span>{redirectTo}</span>
              )}
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
