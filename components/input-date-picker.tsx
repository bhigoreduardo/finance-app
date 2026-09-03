import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { format, isValid, parse } from 'date-fns'

import { cn } from '@/lib/utils'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'

type Props = {
  id?: string
  value?: Date
  label: string
  onChange?: (date: Date | undefined) => void
  disabled?: boolean
  enabledTime?: boolean
}

export const InputDatePicker = ({
  id,
  value,
  label,
  onChange,
  disabled,
  enabledTime = false,
}: Props) => {
  const [open, setOpen] = useState(false)
  const [timeValue, setTimeValue] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [currentMonth, setCurrentMonth] = useState<Date>(value || new Date())

  const formatDisplay = (date: Date | undefined) => {
    if (!date) return ''
    return format(date, 'dd/MM/yyyy')
  }

  useEffect(() => {
    if (value && isValid(value)) {
      setInputValue(formatDisplay(value))
      setCurrentMonth(value)
      if (enabledTime) {
        setTimeValue(format(value, 'HH:mm'))
      }
    } else {
      setInputValue('')
      setTimeValue('')
    }
  }, [value, enabledTime])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')

    if (value.length > 8) {
      value = value.slice(0, 8)
    }

    let formattedValue = value
    if (value.length > 4) {
      formattedValue = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(
        4,
      )}`
    } else if (value.length > 2) {
      formattedValue = `${value.slice(0, 2)}/${value.slice(2)}`
    }

    setInputValue(formattedValue)

    if (value.length === 8) {
      const day = parseInt(value.slice(0, 2))
      const month = parseInt(value.slice(2, 4)) - 1
      const year = parseInt(value.slice(4))

      const parsedDate = new Date(year, month, day)
      if (isValid(parsedDate)) {
        updateDateWithTime(parsedDate, timeValue)
        setCurrentMonth(parsedDate)
      }
    } else if (value.length === 0 && onChange) {
      onChange?.(undefined)
    }
  }

  const updateDateWithTime = (date: Date, time: string) => {
    if (!enabledTime || !time) {
      onChange?.(date)
      return
    }

    const [hours, minutes] = time.split(':').map(Number)
    const newDate = new Date(date)
    newDate.setHours(hours)
    newDate.setMinutes(minutes)
    onChange?.(newDate)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value
    setTimeValue(time)

    if (inputValue) {
      try {
        const parsedDate = parse(inputValue, 'dd/MM/yyyy', new Date())
        if (isValid(parsedDate)) {
          updateDateWithTime(parsedDate, time)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      updateDateWithTime(date, timeValue)
      setCurrentMonth(date)
    } else {
      onChange?.(undefined)
    }
    setOpen(false)
  }

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date)
  }

  return (
    <div className="relative w-full flex items-center gap-2">
      <div className="grow relative">
        <Input
          id={id}
          value={inputValue}
          placeholder="dd/mm/aaaa"
          disabled={disabled}
          inputMode="numeric"
          className={cn(
            'w-full bg-background pr-10',
            !inputValue && 'text-muted-foreground',
          )}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild id={id}>
            <Button
              variant="ghost"
              size="icon"
              disabled={disabled}
              className="absolute top-1/2 size-8 -translate-y-1/2 right-1"
            >
              <CalendarIcon className="size-4" />
              <span className="sr-only">{label}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={value}
              captionLayout="dropdown"
              month={currentMonth}
              onMonthChange={handleMonthChange}
              onSelect={handleCalendarSelect}
              disabled={disabled}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>
      {enabledTime && (
        <Input
          className="w-25 min-w-25"
          type="time"
          value={timeValue}
          onChange={handleTimeChange}
          disabled={disabled || !inputValue}
        />
      )}
    </div>
  )
}
