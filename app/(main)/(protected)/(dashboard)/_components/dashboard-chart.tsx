import {
  type Summary,
  useGetSummary,
} from '@/features/summary/api/use-get-summary'
import { ChartVariant } from '@/components/chart/chart-variant'

export const DashboardChart = () => {
  const { data } = useGetSummary()

  if (!data) return null

  const { days, categories } = data

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <ChartVariant
        title="Análise da contas"
        data={days}
        fields={[
          {
            key: 'income',
            color: 'var(--chart-2)',
            label: 'Receitas',
          },
          {
            key: 'expenses',
            color: 'var(--chart-5)',
            label: 'Despesas',
          },
        ]}
      />
      {/* <DonutVariant
        title="Mais vendidos"
        data={mostSales}
        fields={
          !!mostSales.length
            ? [
                ...mostSales.map((_, index) => ({
                  key: `name`,
                  color: `var(--chart-${index})`,
                  label: 'Quantidade',
                })),
                {
                  key: 'quantity',
                  color: 'var(--chart-1)',
                  label: 'Quantidade',
                },
              ]
            : []
        }
      /> */}
    </div>
  )
}
