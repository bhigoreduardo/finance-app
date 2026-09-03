import { cn } from '@/lib/utils'

export const Container = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  return (
    <section className={cn('max-w-7xl mx-auto px-4', className)} {...props}>
      {children}
    </section>
  )
}
