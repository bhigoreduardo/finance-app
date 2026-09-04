'use client'

import { useFilterSummary } from '@/features/summary/hooks/use-filter-summary'

import {
  TitleProtected as Title,
  SubTitleProtected as SubTitle,
} from '@/components/title-custom'
import { Skeleton } from '@/components/ui/skeleton'
import { SelectRangePicker } from '@/components/select-range-picker'

import { DashboardChart } from '@/app/(main)/(protected)/(dashboard)/_components/dashboard-chart'
import { DashboardSummary } from '@/app/(main)/(protected)/(dashboard)/_components/dashboard-summary'

export default function DashboardPage() {
  const { from, to, rangeValue, onChange, onClear } = useFilterSummary()

  return (
    <section>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-col gap-2">
            <Title>Início</Title>
            <SubTitle>Acompanhe seu desempenho financeiro</SubTitle>
          </div>
          <SelectRangePicker
            from={from}
            to={to}
            rangeValue={rangeValue}
            onChange={onChange}
            onClear={onClear}
          />
        </div>
        <DashboardSummary />
        <DashboardChart />
      </div>
    </section>
  )
}
