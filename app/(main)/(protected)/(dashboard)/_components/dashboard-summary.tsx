import { PiggyBankIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react'

import { formatDateRange, formatPercentage } from '@/lib/utils'

import {
  type Summary,
  useGetSummary,
} from '@/features/summary/api/use-get-summary'
import { useFilterSummary } from '@/features/summary/hooks/use-filter-summary'

import {
  type Props as CardOverviewProps,
  CardOverview,
  CardOverviewLoading,
} from '@/components/card-overview'

export const DashboardSummary = () => {
  const { data } = useGetSummary()
  const { from, to } = useFilterSummary()

  if (!data) return null

  const dateRangeLabel = formatDateRange({ to, from })

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
      value: remainingAmount ? remainingAmount : undefined,
      description: 'Total de pedidos entregues',
      subtitle: `${formatPercentage(remainingChange, { addPrefix: true })} no período`,
      icon: PiggyBankIcon,
      variant: 'default',
      dateRange: dateRangeLabel,
    },
    {
      title: 'Receitas',
      value: incomeAmount ? incomeAmount : undefined,
      description: 'Total de receitas',
      subtitle: `${formatPercentage(incomeChange, { addPrefix: true })} no período`,
      icon: TrendingUpIcon,
      variant: 'success',
      dateRange: dateRangeLabel,
    },
    {
      title: 'Despesas',
      value: expensesAmount ? expensesAmount : undefined,
      description: 'Total de despesas',
      subtitle: `${formatPercentage(expensesChange, { addPrefix: true })} no período`,
      icon: TrendingDownIcon,
      variant: 'danger',
      dateRange: dateRangeLabel,
    },
  ]

  return (
    <div className="flex flex-col gap-2">
      <div className="grid md:grid-cols-3 gap-4">
        {overviews.map((overview, index) => (
          <CardOverview key={index} {...overview} />
        ))}
      </div>
    </div>
  )
}
