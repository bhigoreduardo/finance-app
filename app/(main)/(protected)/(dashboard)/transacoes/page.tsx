'use client'

import { useGetTransactions } from '@/features/transaction/api/use-get-transactions'

import {
  TitleProtected as Title,
  SubTitleProtected as SubTitle,
} from '@/components/title-custom'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTableLoading } from '@/components/data-table'
import { TableTransaction } from '@/features/transaction/components/table-transaction'

export default function TransactionPage() {
  const transactionsQuery = useGetTransactions()
  const transactions = transactionsQuery.data || []

  const isLoading = transactionsQuery.isLoading

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
          <Title>Transações</Title>
          <SubTitle>Gerenciar as transações de receitas e despesas</SubTitle>
        </div>
        <TableTransaction data={transactions} />
      </div>
    </section>
  )
}
