'use client'

import { useMemo } from 'react'
import { FileSearchIcon } from 'lucide-react'
import { Label, Pie, PieChart } from 'recharts'

import { FILTER_NUMERIC_FIELDS } from '@/constants'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'

export const PieVariant = ({ data, fields }: VariantProps) => {
  const dataKey = useMemo(() => {
    const numericField = fields.find((field) =>
      FILTER_NUMERIC_FIELDS.some((term) =>
        field.key.toLowerCase().includes(term),
      ),
    )
    return numericField?.key || fields[1]?.key || 'quantity'
  }, [fields])

  const nameKey = useMemo(() => {
    const labelField = fields.find((field) =>
      ['name', 'label', 'browser', 'id', 'title'].some((term) =>
        field.key.toLowerCase().includes(term),
      ),
    )
    return labelField?.key || fields[0]?.key || 'name'
  }, [fields])

  const total = useMemo(() => {
    if (!data || data.length === 0) return 0

    return data.reduce((acc, curr) => {
      const value = curr[dataKey]
      return acc + (typeof value === 'number' ? value : 0)
    }, 0)
  }, [data, dataKey])

  const customConfig = useMemo(() => {
    const config: ChartConfig = {}

    config[dataKey] = {
      label: fields.find((f) => f.key === dataKey)?.label || 'Quantidade',
    }

    data.forEach((item, index) => {
      const itemKey = typeof item.id === 'string' ? item.id : `item-${index}`
      config[itemKey] = {
        label: typeof item.name === 'string' ? item.name : `Item ${index + 1}`,
        color: `var(--chart-${(index % 5) + 1})`,
      }
    })

    return config
  }, [data, dataKey, fields])

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []

    return data.map((item, index) => {
      const colorIndex = (index % 5) + 1

      return {
        ...item,
        fill: `var(--chart-${colorIndex})`,
        itemId: typeof item.id === 'string' ? item.id : `item-${index}`,
      }
    })
  }, [data])

  const badges = useMemo(() => {
    if (!data || data.length === 0) return []

    return data.map((item, index) => {
      const value = item[dataKey]
      const colorIndex = (index % 5) + 1
      const color = `var(--chart-${colorIndex})`

      return {
        label: item[nameKey] || `Item ${index + 1}`,
        value: typeof value === 'number' ? value : 0,
        color,
        percentage: total > 0 ? ((Number(value) / total) * 100).toFixed(1) : 0,
      }
    })
  }, [data, dataKey, nameKey, total])

  return (
    <div className="flex flex-col">
      {!!data.length ? (
        <ChartContainer
          config={customConfig}
          className="h-62.5 lg:h-100 w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey={dataKey}
              nameKey={nameKey}
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {fields.find((f) => f.key === dataKey)?.label ||
                            dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      ) : (
        <div className="h-62.5 lg:h-100 w-full flex items-center justify-center text-center text-sm text-muted-foreground">
          <FileSearchIcon className="size-5 text-muted-foreground mr-2" />
          Não foram encontrados dados para este período
        </div>
      )}

      {!!data.length && (
        <div className="flex flex-wrap gap-2 justify-center mx-auto">
          {badges.map((badge, index) => (
            <Badge
              key={index}
              variant="outline"
              className="flex items-center gap-2 cursor-default"
            >
              <div
                className="size-2 shrink-0 rounded-xs"
                style={{
                  backgroundColor: badge.color,
                }}
              />
              <span className="flex items-center gap-1">
                {badge.label}
                <span className="text-xs text-muted-foreground">
                  ({badge.percentage}%)
                </span>
                <span className="font-mono">
                  {badge.value.toLocaleString()}
                </span>
              </span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
