import { useState } from 'react'
import { ChartPieIcon, FileChartPieIcon } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { PieVariant } from '@/components/chart/pie-variant'
import { RadialVariant } from '@/components/chart/radial-variant'
import { WrapperVariant } from '@/components/chart/wrapper-variant'

type Props = {
  title: string
} & VariantProps

export const DonutVariant = ({ data, fields, title }: Props) => {
  const [type, setType] = useState<ChartVariantType>('PIE')

  const onChange = (type: ChartVariantType) => setType(type)

  return (
    <WrapperVariant
      title={title}
      options={<Options type={type} cb={onChange} />}
    >
      <>
        {type === 'PIE' && <PieVariant data={data} fields={fields} />}
        {type === 'RADIAL' && <RadialVariant data={data} fields={fields} />}
      </>
    </WrapperVariant>
  )
}

export const DonutVariantLoading = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-25" />
        <Skeleton className="h-9 w-25" />
      </div>
      <Skeleton className="h-87.5 w-full" />
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
        <SelectItem value="PIE">
          <div className="flex items-center">
            <ChartPieIcon className="size-4 mr-2 shrink-0" />
            <p className="line-clamp-1">Circular</p>
          </div>
        </SelectItem>
        <SelectItem value="RADIAL">
          <div className="flex items-center">
            <FileChartPieIcon className="size-4 mr-2 shrink-0" />
            <p className="line-clamp-1">Radial</p>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
