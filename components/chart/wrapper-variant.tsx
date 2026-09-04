import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
  title: string
  options?: React.JSX.Element
  children: React.ReactNode
}

export const WrapperVariant = ({ title, options, children }: Props) => {
  return (
    <Card className="flex flex-col gap-2 rounded-sm shadow-none p-2">
      <CardHeader className="flex items-center justify-between p-0">
        <CardTitle className="font-normal text-base line-clamp-1">
          {title}
        </CardTitle>
        {options && options}
      </CardHeader>
      <CardContent className="px-0 flex-1">{children}</CardContent>
    </Card>
  )
}
