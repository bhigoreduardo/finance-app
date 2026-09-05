'use client'

import { useState } from 'react'
import { ptBR } from 'date-fns/locale'
import { FileSearchIcon } from 'lucide-react'
import { format, isValid, parseISO } from 'date-fns'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'

export const BarVariant = ({ data, fields }: VariantProps) => {
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

  return (
    <div className="flex flex-col">
      {!!data.length ? (
        <ChartContainer
          config={customConfig}
          className="h-62.5 lg:h-100 w-full"
        >
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              style={{ fontSize: '12px' }}
              tickLine={false}
              tickMargin={8}
              axisLine={false}
            />
            <ChartTooltip
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
                <Bar
                  key={field.key}
                  dataKey={field.key}
                  stackId="a"
                  fill={`var(--color-${field.key})`}
                  radius={[0, 0, 4, 4]}
                />
              ))}
          </BarChart>
        </ChartContainer>
      ) : (
        <div className="h-62.5 lg:h-100 w-full flex items-center justify-center text-center text-sm text-muted-foreground">
          <FileSearchIcon className="size-5 text-muted-foreground mr-2" />
          Não foram encontrados dados para este período
        </div>
      )}

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
                className="h-2 w-2 shrink-0 rounded-xs"
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
