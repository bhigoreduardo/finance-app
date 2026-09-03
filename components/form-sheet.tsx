import { CircleCheckIcon, CircleXIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from '@/components/ui/sheet'
import { ButtonLoading } from '@/components/button-loading'

type Props = {
  formId: string
  title: string
  description: string
  isOpen: boolean
  isPending?: boolean
  handleClose: () => void
  className?: string
  children: React.ReactNode
}

export const FormSheet = ({
  formId,
  title,
  description,
  isOpen,
  isPending,
  handleClose,
  className,
  children,
}: Props) => {
  const handleSubmit = () => {
    document
      .getElementById(formId)
      ?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className={cn('w-full overflow-y-auto', className)}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="px-4">{children}</div>
        <SheetFooter className="grid sm:grid-cols-2 gap-2">
          <SheetClose asChild>
            <ButtonLoading
              disabled={isPending}
              className="w-full"
              variant="secondary"
            >
              <CircleXIcon className="size-4" />
              Cancelar
            </ButtonLoading>
          </SheetClose>
          <ButtonLoading
            type="submit"
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full"
          >
            <CircleCheckIcon className="size-4" />
            Salvar
          </ButtonLoading>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
