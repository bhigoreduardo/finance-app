import {
  CalendarIcon,
  PiggyBankIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from 'lucide-react'

import { formatCurrency } from '@/lib/utils'

import {
  type Summary,
  useGetSummary,
} from '@/features/summary/api/use-get-summary'
import { useFilterSummary } from '@/features/summary/hooks/use-filter-summary'

import {
  type Props as CardOverviewProps,
  CardOverview,
} from '@/components/card-overview'

import { Card, CardContent } from '@/components/ui/card'

export const DashboardSummary = () => {
  const { data, isLoading } = useGetSummary()
  const { from, to } = useFilterSummary()

  if (!data) return null

  const {
    remainingAmount,
    remainingChange,
    incomeAmount,
    incomeChange,
    expensesAmount,
    expensesChange,
  } = data

  const overviews: CardOverviewProps[] = [
    {
      title: 'Restante',
      value: remainingAmount ? formatCurrency(remainingAmount) : undefined,
      description: 'Total de pedidos entregues',
      subtitle: `${remainingChange}`,
      icon: PiggyBankIcon,
      variant: 'default',
    },
    {
      title: 'Receitas',
      value: incomeAmount ? `${formatCurrency(incomeAmount)}` : undefined,
      description: 'Total de receitas',
      subtitle: `${incomeChange}`,
      icon: TrendingUpIcon,
      variant: 'success',
    },
    {
      title: 'Despesas',
      value: expensesAmount ? `${formatCurrency(expensesAmount)}` : undefined,
      description: 'Total de despesas',
      subtitle: `${expensesChange}`,
      icon: TrendingDownIcon,
      variant: 'danger',
    },
  ]

  return (
    <div className="flex flex-col gap-2">
      <div className="grid md:grid-cols-3 gap-4">
        {overviews.map((overview, index) => (
          <CardOverview key={index} {...overview} />
        ))}
      </div>
      <div className="grid lg:grid-cols-4 flex-1 items-center gap-4 sm:w-fit w-full"></div>
    </div>
  )
}
