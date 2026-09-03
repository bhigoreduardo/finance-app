import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

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
