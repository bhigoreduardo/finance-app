import { endOfDay, startOfDay, subDays } from 'date-fns'

import { Label } from '@/components/ui/label'
import { SelectFilter } from '@/components/select-filter'
import { InputDateRangePicker } from '@/components/input-date-range-picker'

type OnChangeParams = {
  from?: string
  to?: string
  today?: boolean
  rangeValue?: string
}

type Props = {
  from?: string
  to?: string
  rangeValue?: string
  onChange: (params: OnChangeParams) => void
  onClear: () => void
}

export const SelectRangePicker = ({
  from,
  to,
  rangeValue,
  onChange,
  onClear,
}: Props) => {
  const data: FilterOptionsProps = [
    { value: '1D', label: 'Hoje' },
    { value: '7D', label: '7 dias' },
    { value: '30D', label: '30 dias' },
    { value: '90D', label: '3 meses' },
    { value: 'CUSTOM', label: 'Intervalo' },
  ]

  const handlePicker = (value: RangeValue) => {
    const today = new Date()

    switch (value) {
      case '1D': {
        onChange({
          today: true,
          from: undefined,
          to: undefined,
          rangeValue: value,
        })
        break
      }
      case '7D': {
        const from = startOfDay(subDays(today, 6))
        const to = endOfDay(today)
        onChange({
          today: false,
          from: from.toISOString(),
          to: to.toISOString(),
          rangeValue: value,
        })
        break
      }
      case '30D': {
        const from = startOfDay(subDays(today, 29))
        const to = endOfDay(today)
        onChange({
          today: false,
          from: from.toISOString(),
          to: to.toISOString(),
          rangeValue: value,
        })
        break
      }
      case '90D': {
        const from = startOfDay(subDays(today, 89))
        const to = endOfDay(today)
        onChange({
          today: false,
          from: from.toISOString(),
          to: to.toISOString(),
          rangeValue: value,
        })
        break
      }
      case 'CUSTOM':
        onChange({ rangeValue: value })
        break
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      <div className="flex flex-col">
        <Label className="text-xs text-muted-foreground mb-1 ml-1">
          Filtro
        </Label>
        <SelectFilter
          placeholder="Selecione status"
          defaultValue={undefined}
          value={rangeValue}
          data={data}
          onChange={(value: RangeValue) => handlePicker(value)}
        />
      </div>
      {rangeValue === 'CUSTOM' && (
        <div className="flex flex-col">
          <Label className="text-xs text-muted-foreground mb-1 ml-1">
            Intervalo
          </Label>
          <InputDateRangePicker
            from={from}
            to={to}
            onChangeFilterDate={(from, to) =>
              onChange({ today: false, from, to, rangeValue: 'CUSTOM' })
            }
            onClearFilterDate={onClear}
          />
        </div>
      )}
    </div>
  )
}
