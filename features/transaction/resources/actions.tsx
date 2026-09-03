import { MoreHorizontalIcon, PencilRulerIcon, TrashIcon } from 'lucide-react'

import { useConfirm } from '@/hooks/use-confirm'
import { useOpenTransaction } from '@/features/transaction/hooks/use-open-transaction'
import { useDeleteTransaction } from '@/features/transaction/api/use-delete-transaction'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

type Props = {
  id: string
}

export const Actions = ({ id }: Props) => {
  const { onOpen } = useOpenTransaction()

  const [ConfirmationDialog, confirm] = useConfirm(
    'Deseja realmente continuar?',
    'Você não poderá reverter a ação depois, perdendo essa informação.',
  )

  const deleteMutation = useDeleteTransaction(id)

  const handleDelete = async () => {
    const ok = await confirm()

    if (ok) {
      deleteMutation.mutate(undefined)
    }
  }

  return (
    <>
      <ConfirmationDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onOpen(id)}>
            <PencilRulerIcon className="size-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} variant="destructive">
            <TrashIcon className="size-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
