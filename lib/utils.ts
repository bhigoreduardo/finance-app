import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'
import { eachDayOfInterval, isSameDay } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertAmountFromMiliunits(amount: number | null) {
  if (!amount) return 0

  return amount / 1000
}

export function convertAmountToMiliunits(
  amount: number | string | undefined | null,
) {
  if (!amount) return 0

  const currAmount =
    typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '.')) : amount

  return Math.round(currAmount * 1000)
}

export function formatCurrency(
  value: number,
  options: {
    hideCurrencySymbol?: boolean
    hideCents?: boolean
    customLocale?: string
  } = {},
): string {
  const {
    hideCurrencySymbol = false,
    hideCents = false,
    customLocale = 'pt-BR',
  } = options

  const formatOptions: Intl.NumberFormatOptions = {
    style: hideCurrencySymbol ? 'decimal' : 'currency',
    currency: 'BRL',
    minimumFractionDigits: hideCents ? 0 : 2,
    maximumFractionDigits: hideCents ? 0 : 2,
  }

  return new Intl.NumberFormat(customLocale, formatOptions).format(value)
}

export function fillMissingDays(
  data: VariantProps['data'],
  startDate: Date,
  endDate: Date,
) {
  if (data.length === 0) {
    return []
  }

  const keys = new Set<string>()
  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (key !== 'date') {
        keys.add(key)
      }
    })
  })

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  const transactionsByDay = allDays.map((day) => {
    const found = data.find((d) =>
      isSameDay(new Date(d.date + 'T00:00:00'), day),
    )

    if (found) {
      return { ...found, date: day.toISOString().split('T')[0] }
    } else {
      const emptyEntry: Record<string, number | string> = {
        date: day.toISOString().split('T')[0],
      }
      keys.forEach((key) => {
        emptyEntry[key] = 0
      })
      return emptyEntry
    }
  })

  return transactionsByDay
}

export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100
  }

  return ((previous - current) / previous) * 100
}

export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean } = { addPrefix: false },
) {
  const result = new Intl.NumberFormat('en-US', {
    style: 'percent',
  }).format(value / 100)

  if (options.addPrefix && value > 0) {
    return `+${result}`
  }

  return result
}
