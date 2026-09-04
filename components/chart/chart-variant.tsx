import { useState } from 'react'
import { AreaChartIcon, BarChart3Icon, ChartLineIcon } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { BarVariant } from '@/components/chart/bar-variant'
import { AreaVariant } from '@/components/chart/area-variant'
import { LinearVariant } from '@/components/chart/linear-variant'
import { WrapperVariant } from '@/components/chart/wrapper-variant'

type Props = {
  title: string
} & VariantProps

export const ChartVariant = ({ data, fields, title }: Props) => {
  const [type, setType] = useState<ChartVariantType>('AREA')

  const onChange = (type: ChartVariantType) => setType(type)

  return (
    <WrapperVariant
      title={title}
      options={<Options type={type} cb={onChange} />}
    >
      <>
        {type === 'AREA' && <AreaVariant data={data} fields={fields} />}
        {type === 'BAR' && <BarVariant data={data} fields={fields} />}
        {type === 'LINEAR' && <LinearVariant data={data} fields={fields} />}
      </>
    </WrapperVariant>
  )
}

export const ChartVariantLoading = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-25" />
        <Skeleton className="h-9 w-25" />
      </div>
      <Skeleton className="h-82 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  )
}

const Options = ({
  type,
  cb,
}: {
  type: ChartVariantType
  cb: (type: ChartVariantType) => void
}) => {
  return (
    <Select defaultValue={type} onValueChange={cb}>
      <SelectTrigger>
        <SelectValue placeholder="Tipo do gráfico" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="AREA">
          <div className="flex items-center">
            <AreaChartIcon className="size-4 mr-2 shrink-0" />
            <p className="line-clamp-1">Área</p>
          </div>
        </SelectItem>
        <SelectItem value="BAR">
          <div className="flex items-center">
            <BarChart3Icon className="size-4 mr-2 shrink-0" />
            <p className="line-clamp-1">Barras</p>
          </div>
        </SelectItem>
        <SelectItem value="LINEAR">
          <div className="flex items-center">
            <ChartLineIcon className="size-4 mr-2 shrink-0" />
            <p className="line-clamp-1">Linhas</p>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
