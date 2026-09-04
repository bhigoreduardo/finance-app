'use client'

import { useMemo } from 'react'
import { Label, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts'

import { FILTER_NUMERIC_FIELDS } from '@/constants'

import { useMediaQuery } from '@/hooks/use-media-query'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'

export const RadialVariant = ({ data, fields }: VariantProps) => {
  const isMobile = useMediaQuery('(min-width: 1024px)')
  const height = isMobile ? 350 : undefined

  // TODO: Problema do label nesse dataKey
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
      ['name', 'label', 'title', 'browser', 'id'].some((term) =>
        field.key.toLowerCase().includes(term),
      ),
    )
    return labelField?.key || fields[0]?.key || 'name'
  }, [fields])

  const total = useMemo(() => {
    if (!data?.length) return 0
    return data.reduce((acc, curr) => {
      const value = curr[dataKey]
      return acc + (typeof value === 'number' ? value : 0)
    }, 0)
  }, [data, dataKey])

  const chartData = useMemo(() => {
    if (!data?.length) return []

    return data.map((item, index) => {
      const colorIndex = (index % 5) + 1
      return {
        ...item,
        fill: `var(--chart-${colorIndex})`,
      }
    })
  }, [data])

  const customConfig = useMemo(() => {
    const config: ChartConfig = {}

    config[dataKey] = {
      label: fields.find((f) => f.key === dataKey)?.label || 'Quantidade',
    }

    data.forEach((item, index) => {
      const itemKey = typeof item.id === 'string' ? item.id : `item-${index}`
      config[itemKey] = {
        label: item[nameKey] || `Item ${index + 1}`,
        color: `var(--chart-${(index % 5) + 1})`,
      }
    })

    return config
  }, [data, dataKey, fields, nameKey])

  const badges = useMemo(() => {
    if (!data?.length) return []

    return data.map((item, index) => {
      const value = item[dataKey]
      const colorIndex = (index % 5) + 1
      return {
        label: item[nameKey] || `Item ${index + 1}`,
        value: typeof value === 'number' ? value : 0,
        color: `var(--chart-${colorIndex})`,
        percentage: total > 0 ? ((Number(value) / total) * 100).toFixed(1) : 0,
      }
    })
  }, [data, dataKey, nameKey, total])

  console.log({
    dataKey,
    nameKey,
  })

  return (
    <div className="flex flex-col">
      <ResponsiveContainer width="100%" height={height}>
        <ChartContainer
          config={customConfig}
          className="mx-auto aspect-square max-h-62.5 w-full"
        >
          {!!data.length ? (
            <RadialBarChart
              data={chartData}
              innerRadius={60}
              outerRadius={140}
              startAngle={90}
              endAngle={-270}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <RadialBar dataKey={dataKey} background cornerRadius={6}>
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
                          <tspan className="fill-foreground text-3xl font-bold">
                            {total.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            dy={24}
                            className="fill-muted-foreground"
                          >
                            {fields.find((f) => f.key === dataKey)?.label ||
                              dataKey}
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </RadialBar>
            </RadialBarChart>
          ) : (
            <p className="h-full w-full flex items-center justify-center text-center text-sm text-muted-foreground">
              Não foram encontrados dados para este período
            </p>
          )}
        </ChartContainer>
      </ResponsiveContainer>

      {!!data.length && (
        <div className="flex flex-wrap gap-2 justify-center mx-auto">
          {badges.map((badge, index) => (
            <Badge
              key={index}
              variant="outline"
              className="flex items-center gap-2 cursor-default"
            >
              <div
                className="size-2 shrink-0 rounded-[2px]"
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
