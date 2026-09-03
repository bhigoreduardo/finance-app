/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, ReactNode } from 'react'

import { cn } from '@/lib/utils'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SelectFilterProps<OptionType extends { label: any; value: any }> {
  id?: string
  placeholder: string
  defaultValue?: any
  data: OptionType[]
  value?: any
  name?: string
  isDisabled?: boolean
  isDefaultDisabled?: boolean
  className?: string
  onChange: (value: any) => void
  isInvalid?: boolean
  'aria-invalid'?: boolean
  'aria-describedby'?: string
  renderOption?: (option: OptionType) => ReactNode
}

const SelectFilterInner = <OptionType extends { label: any; value: any }>(
  {
    id,
    placeholder,
    defaultValue,
    data,
    value,
    name,
    isDisabled,
    isDefaultDisabled = true,
    className,
    onChange,
    isInvalid,
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedby,
    renderOption,
  }: SelectFilterProps<OptionType>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) => {
  const selectValue =
    value === undefined || value === null ? 'undefined' : String(value)
  const selectDefaultValue =
    defaultValue === undefined || defaultValue === null
      ? 'undefined'
      : String(defaultValue)

  return (
    <Select
      value={selectValue}
      defaultValue={selectDefaultValue}
      disabled={isDisabled}
      onValueChange={(val) => {
        onChange(val === 'undefined' ? undefined : val)
      }}
      name={name}
    >
      <SelectTrigger
        ref={ref}
        id={id}
        className={cn(
          'w-45',
          renderOption &&
            'h-auto! py-2 *:data-[slot=select-value]:line-clamp-none',
          className,
          isInvalid && 'border-destructive focus:ring-destructive/20',
        )}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {data.map((item, i) => (
            <SelectItem
              key={i}
              value={
                item.value === undefined ? 'undefined' : String(item.value)
              }
              disabled={item.value === undefined && isDefaultDisabled}
            >
              {renderOption ? renderOption(item) : item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export const SelectFilter = forwardRef(SelectFilterInner) as <
  OptionType extends { label: any; value: any },
>(
  props: SelectFilterProps<OptionType> & {
    ref?: React.ForwardedRef<HTMLButtonElement>
  },
) => ReturnType<typeof SelectFilterInner>
