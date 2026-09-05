'use client'

import { useState } from 'react'
import { ptBR } from 'date-fns/locale'
import { FileSearchIcon } from 'lucide-react'
import { format, isValid, parseISO } from 'date-fns'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'

export const AreaVariant = ({ data, fields }: VariantProps) => {
  const [activeFields, setActiveFields] = useState<string[]>(
    fields.map((field) => field.key),
  )

  const customConfig = fields.reduce((acc, field) => {
    acc[field.key] = {
      label: field.label,
      color: field.color,
    }
    return acc
  }, {} as ChartConfig)

  console.log({ data, customConfig })

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
      {!!data.length ? (
        <ChartContainer
          config={customConfig}
          className="h-62.5 lg:h-100 w-full"
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              {fields.map((field) => (
                <linearGradient
                  key={field.key}
                  id={field.key}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={field.color} stopOpacity={0.8} />
                  <stop
                    offset="95%"
                    stopColor={field.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              style={{ fontSize: '12px' }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
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
                <Area
                  key={field.key}
                  type="monotone"
                  dataKey={field.key}
                  stackId={field.key}
                  strokeWidth={2}
                  stroke={field.color}
                  fill={`url(#${field.key})`}
                  fillOpacity={0.4}
                  className="drop-shadow-sm"
                />
              ))}
          </AreaChart>
        </ChartContainer>
      ) : (
        <div className="h-62.5 lg:h-100 w-full flex items-center justify-center text-center text-sm text-muted-foreground">
          <FileSearchIcon className="size-5 text-muted-foreground mr-2" />
          Não foram encontrados dados para este período
        </div>
      )}

      {!!data.length && (
        <div className="sm:flex items-center justify-center hidden flex-wrap gap-1 mx-auto">
          {fields.map((field, index) => (
            <Badge
              key={index}
              variant={activeFields.includes(field.key) ? 'default' : 'outline'}
              onClick={() => toggleFieldVisibility(field.key)}
              className="flex items-center gap-1 cursor-pointer"
            >
              <div
                className="size-2 shrink-0 rounded-xs"
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
