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
