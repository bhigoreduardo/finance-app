declare type FilterOptionsProps = {
  label: any
  value: any
}[]

declare type PasswordOptionsProps = 'STRONG' | 'GOOD' | 'WEAK'

declare type VariantProps = {
  data: {
    date?: string
    [key: string]: number | string
  }[]
  fields: DataField[]
}

declare type RangeValue = '1D' | '7D' | '30D' | '90D' | 'CUSTOM'

declare type ChartVariantType = 'AREA' | 'BAR' | 'LINEAR' | 'PIE' | 'RADIAL'
