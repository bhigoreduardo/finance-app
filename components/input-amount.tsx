import { useEffect } from 'react'
import CurrencyInput from 'react-currency-input-field'
import { Info, MinusCircle, PlusCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type Props = {
  id?: string
  value: string
  onChange: (value: string | undefined) => void
  placeholder?: string
  isPending?: boolean
  isExpenses?: boolean
  isTooltip?: boolean
  disabled?: boolean
  hasError?: boolean
}

export const InputAmount = ({
  id,
  value,
  onChange,
  placeholder,
  isPending,
  isExpenses,
  isTooltip = true,
  disabled,
  hasError,
}: Props) => {
  const parsedValue = parseFloat(value)
  const isIncome = parsedValue > 0
  const isExpense = parsedValue < 0

  const onReverseValue = () => {
    if (!value) return
    const newValue = parseFloat(value) * -1
    onChange(newValue.toString())
  }

  useEffect(() => {
    if (disabled && isExpenses) {
      const newValue = parseFloat(value)
      if (newValue > 0) onChange((newValue * -1).toString())
    }
  }, [value, disabled, isExpense, onChange]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isExpenses) return

    const numeric = parseFloat(value)

    if (!isNaN(numeric) && numeric > 0) {
      onChange(String(-numeric))
    }
  }, [value, isExpenses, onChange])

  return (
    <div className="relative w-full">
      {isTooltip && (
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onReverseValue}
                disabled={disabled}
                className={cn(
                  'bg-slate-400 hover:bg-slate-500 absolute top-1.5 left-1.5 rounded-md p-2 flex items-center justify-center transition cursor-pointer',
                  isIncome && 'bg-emerald-500 hover:bg-emerald-600',
                  isExpense && 'bg-rose-500 hover:bg-rose-600',
                )}
              >
                {!parsedValue && <Info className="size-3 text-white" />}
                {isIncome && <PlusCircle className="size-3 text-white" />}
                {isExpense && <MinusCircle className="size-3 text-white" />}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              Use [+] para receita e [-] para despesa
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <CurrencyInput
        prefix="R$"
        id={id}
        className={cn(
          'h-10 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
          isTooltip && 'pl-10',
          hasError && 'border-red-500',
        )}
        placeholder={placeholder}
        value={value}
        decimalScale={2}
        decimalsLimit={2}
        onValueChange={onChange}
        disabled={isPending}
      />
      {isTooltip && !!parsedValue && (
        <p className="text-xs text-muted-foreground mt-2">
          {isIncome && 'Esta transação é uma receita'}
          {isExpense && 'Esta transação é uma despesa'}
        </p>
      )}
    </div>
  )
}
