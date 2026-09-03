import {
  SingleValue,
  components,
  NoticeProps,
  FormatOptionLabelMeta,
} from 'react-select'
import { useTheme } from 'next-themes'
import { useMemo, ReactNode } from 'react'
import CreateableSelect from 'react-select/creatable'

import { cn } from '@/lib/utils'

type BaseOption = { label: string; value: string }

type Props<OptionType extends BaseOption> = {
  id?: string
  onChange: (value?: string) => void
  onCreate?: (value: string) => void
  options?: OptionType[]
  value?: string | null | undefined
  disabled?: boolean
  isLoading?: boolean
  placeholder?: string
  hasError?: boolean
  isClearable?: boolean
  renderOption?: (
    option: OptionType,
    meta: FormatOptionLabelMeta<OptionType>,
  ) => ReactNode
}

const NoOptionsMessage = <OptionType extends BaseOption>(
  props: NoticeProps<OptionType, false>,
) => {
  return (
    <components.NoOptionsMessage {...props}>
      <span>Nenhuma opção disponível</span>
    </components.NoOptionsMessage>
  )
}

export const SelectCreate = <OptionType extends BaseOption>({
  id,
  onChange,
  onCreate,
  options = [],
  value,
  disabled,
  isLoading,
  placeholder,
  hasError,
  isClearable = true,
  renderOption,
}: Props<OptionType>) => {
  const { theme } = useTheme()

  const isDark = theme === 'dark'
  const borderColor = hasError ? '#fb2c36' : isDark ? '#434343' : '#E4E4E7'
  const textColor = isDark ? '#fff' : '#09090B'
  const placeholderColor = isDark ? '#9EA3A3' : '#64748B'
  const optionBgActive = isDark ? '#27272A' : '#F4F4F5'
  const optionText = isDark ? '#FAFAFA' : '#09090B'
  const menuBg = isDark ? '#09090B' : '#fff'
  const menuBorderColor = isDark ? '#27272A' : '#fff'
  const fieldBg = isDark ? '#212121' : 'transparent'

  const formatedValue = useMemo(() => {
    return options.find((option) => option.value === value)
  }, [options, value])

  const onSelect = (option: SingleValue<OptionType>) => {
    onChange(option?.value)
  }

  return (
    <CreateableSelect<OptionType, false>
      key={value}
      inputId={id}
      placeholder={placeholder}
      className={cn('text-sm border-input', !renderOption && 'h-10')}
      components={{ NoOptionsMessage }}
      formatOptionLabel={renderOption}
      styles={{
        control: (base, { isDisabled }) => ({
          ...base,
          background: fieldBg,
          borderColor,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          boxShadow: 'none',
          ':hover': {
            borderColor,
          },
          borderRadius: '6px',
          ...(!renderOption && { height: '40px' }),
        }),
        option: (base, { isFocused, isSelected, isDisabled }) => ({
          ...base,
          backgroundColor:
            isSelected || isFocused ? optionBgActive : 'transparent',
          color: optionText,
          paddingLeft: '8px',
          marginLeft: '4px',
          marginRight: '4px',
          width: 'calc(100% - 8px)',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          borderRadius: '4px',
          ':active': {
            ...base[':active'],
            backgroundColor: optionBgActive,
          },
        }),
        placeholder: (base) => ({ ...base, color: placeholderColor }),
        input: (base) => ({ ...base, color: textColor }),
        menu: (base) => ({
          ...base,
          background: menuBg,
          border: '1px solid',
          borderColor: menuBorderColor,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }),
        singleValue: (base) => ({ ...base, color: textColor }),
        clearIndicator: (base) => ({
          ...base,
          color: placeholderColor,
          cursor: 'pointer',
          ':hover': { color: textColor },
        }),
        indicatorSeparator: (base) => ({
          ...base,
          backgroundColor: menuBorderColor,
        }),
      }}
      value={formatedValue}
      onChange={onSelect}
      options={options}
      onCreateOption={onCreate}
      isDisabled={disabled}
      isClearable={isClearable}
      isLoading={isLoading}
      loadingMessage={() => 'Carregando...'}
      formatCreateLabel={(inputValue) => `Adicionar "${inputValue}"`}
    />
  )
}
