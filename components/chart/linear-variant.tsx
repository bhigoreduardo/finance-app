'use client'

import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { useState } from 'react'
import { ptBR } from 'date-fns/locale'
import { format, isValid, parseISO } from 'date-fns'

import { useMediaQuery } from '@/hooks/use-media-query'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'

export const LinearVariant = ({ data, fields }: VariantProps) => {
  const [activeFields, setActiveFields] = useState<string[]>(
    fields.map((field) => field.key),
  )

  const isMobile = useMediaQuery('(min-width: 1024px)')
  const height = isMobile ? 350 : undefined

  const customConfig = fields.reduce((acc, field) => {
    acc[field.key] = {
      label: field.label,
      color: field.color,
    }
    return acc
  }, {} as ChartConfig)

  const toggleFieldVisibility = (key: string) => {
    setActiveFields((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key],
    )
  }

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      if (isValid(date)) {
        return format(date, 'dd MMM', { locale: ptBR })
      }
      return dateString
    } catch (error) {
      return dateString
    }
  }

  const maxValue = Math.max(
    ...data.flatMap((item) =>
      fields
        .filter((field) => activeFields.includes(field.key))
        .map((field) => Number(item[field.key]) || 0),
    ),
  )

  return (
    <div className="flex flex-col">
      <ResponsiveContainer
        width="100%"
        height={height}
        className="flex items-center justify-center"
      >
        <ChartContainer config={customConfig} className="w-full h-full">
          {!!data.length ? (
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                style={{ fontSize: '12px' }}
                tickLine={false}
                tickMargin={8}
                axisLine={false}
              />
              <YAxis domain={[0, maxValue * 1.1]} hide={true} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(label, payload) => {
                      try {
                        const dateStr = payload?.[0]?.payload?.date
                        if (dateStr) {
                          const date = parseISO(dateStr)
                          if (isValid(date)) {
                            return format(date, 'dd/MM/yyyy', {
                              locale: ptBR,
                            })
                          }
                        }
                        return label
                      } catch {
                        return label
                      }
                    }}
                  />
                }
              />
              {fields
                .filter((field) => activeFields.includes(field.key))
                .map((field) => (
                  <Line
                    key={field.key}
                    type="linear"
                    dataKey={field.key}
                    strokeWidth={2}
                    stroke={field.color}
                    dot={{
                      fill: field.color,
                      strokeWidth: 2,
                      r: 4,
                      stroke: 'white',
                    }}
                    activeDot={{
                      r: 6,
                      fill: field.color,
                      stroke: 'white',
                      strokeWidth: 2,
                    }}
                  />
                ))}
            </LineChart>
          ) : (
            <p className="h-full w-full flex items-center justify-center text-center text-sm text-muted-foreground">
              Não foram encontrados dados para este período
            </p>
          )}
        </ChartContainer>
      </ResponsiveContainer>

      {!!data.length && (
        <div className="sm:flex items-center justify-center flex-wrap gap-1 hidden mx-auto">
          {fields.map((field, index) => (
            <Badge
              key={index}
              variant={activeFields.includes(field.key) ? 'default' : 'outline'}
              onClick={() => toggleFieldVisibility(field.key)}
              className="flex items-center gap-1 cursor-pointer"
            >
              <div
                className="size-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: field.color,
                }}
              />
              {field.label}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
