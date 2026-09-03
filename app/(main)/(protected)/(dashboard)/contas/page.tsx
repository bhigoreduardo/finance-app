'use client'

import { useGetBillings } from '@/features/billing/api/use-get-billings'

import {
  TitleProtected as Title,
  SubTitleProtected as SubTitle,
} from '@/components/title-custom'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTableLoading } from '@/components/data-table'
import { TableBilling } from '@/features/billing/components/table-billing'

export default function BillingPage() {
  const billingsQuery = useGetBillings()
  const billings = billingsQuery.data || []

  const isLoading = billingsQuery.isLoading

  if (isLoading) {
    return (
      <section>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7.5 max-w-75" />
            <Skeleton className="h-7.5 max-w-150" />
          </div>
          <DataTableLoading />
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Title>Contas</Title>
          <SubTitle>Gerenciar as contas de receitas e despesas</SubTitle>
        </div>
        <TableBilling data={billings} />
      </div>
    </section>
  )
}
