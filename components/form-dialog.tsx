import { CircleCheckIcon, CircleXIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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

export const FormDialog = ({
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
    <Dialog onOpenChange={handleClose} open={isOpen}>
      <DialogContent
        className={cn(
          'border-none w-full max-w-5xl max-h-[90%] overflow-y-auto',
          className,
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter className="flex items-center sm:flex-row flex-col gap-2">
          <DialogClose asChild>
            <ButtonLoading
              disabled={isPending}
              className="sm:w-fit w-full"
              variant="secondary"
            >
              <CircleXIcon className="size-4" />
              Cancelar
            </ButtonLoading>
          </DialogClose>
          <ButtonLoading
            type="submit"
            onClick={handleSubmit}
            disabled={isPending}
            className="sm:w-fit w-full"
          >
            <CircleCheckIcon className="size-4" />
            Salvar
          </ButtonLoading>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
