import { HelpCircleIcon, LucideIcon } from 'lucide-react'
import { cva, VariantProps } from 'class-variance-authority'

import { cn, formatCurrency } from '@/lib/utils'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CountUp } from '@/components/count-up'
import { Skeleton } from '@/components/ui/skeleton'

const boxVariant = cva('rounded-sm p-2', {
  variants: {
    variant: {
      default: 'bg-primary/20',
      success: 'bg-green-500/20',
      danger: 'bg-red-500/20',
      warning: 'bg-yellow-500/20',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const iconVariant = cva('size-4', {
  variants: {
    variant: {
      default: 'text-primary',
      success: 'text-green-500',
      danger: 'text-red-500',
      warning: 'text-yellow-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

type BoxVariants = VariantProps<typeof boxVariant>
type IconVariants = VariantProps<typeof iconVariant>

export type Props = BoxVariants &
  IconVariants & {
    title: string
    subtitle: string
    description: string
    value?: string | number
    icon: LucideIcon
    dateRange: string
  }

export const CardOverview = ({
  variant,
  title,
  subtitle,
  description,
  value,
  icon: Icon,
  dateRange,
}: Props) => {
  return (
    <Card className="gap-0 p-2 rounded-sm">
      <CardHeader className="flex items-center justify-between p-0">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <HelpCircleIcon className="size-4 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <span className="text-sm text-white">{description}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className={cn('shrink-0', boxVariant({ variant }))}>
          <Icon className={cn(iconVariant({ variant }))} />
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-row justify-between items-center">
        <div className="space-y-1">
          {value ? (
            <>
              <p className="text-sm">
                {typeof value === 'number' ? (
                  <CountUp
                    preserveValue
                    start={0}
                    end={value}
                    decimals={2}
                    decimalPlaces={2}
                    formattingFn={formatCurrency}
                  />
                ) : (
                  value
                )}
              </p>
              <CardDescription className="text-xs text-muted-foreground line-clamp-1">
                {subtitle}
              </CardDescription>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">Sem resultados</p>
              <span className="text-xs text-muted-foreground line-clamp-1">
                -
              </span>
            </>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{dateRange}</span>
      </CardContent>
    </Card>
  )
}

export const CardOverviewLoading = () => {
  return (
    <Card className="gap-0 p-2 rounded-sm">
      <CardHeader className="flex items-center justify-between p-0">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-18" />
          <Skeleton className="size-5 rounded-full" />
        </div>
        <Skeleton className="size-9" />
      </CardHeader>
      <CardContent className="p-0 flex-row justify-between items-center">
        <div className="space-y-1">
          <Skeleton className="h-4 w-18" />
          <Skeleton className="h-4 w-27" />
        </div>
        <Skeleton className="h-4 w-28.5" />
      </CardContent>
    </Card>
  )
}
