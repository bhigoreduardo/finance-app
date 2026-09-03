import { ArrowLeftRightIcon, ChevronDownIcon, TrashIcon } from 'lucide-react'

import { type Transaction } from '@/features/transaction/api/use-get-transactions'

import { useConfirm } from '@/hooks/use-confirm'
import { useIsMobile } from '@/hooks/use-mobile'
import { useSelectedRows } from '@/hooks/use-selected-rows'
import { useNewTransaction } from '@/features/transaction/hooks/use-new-transaction'
import { useBulkDeleteTransactions } from '@/features/transaction/api/use-bulk-delete-transactions'

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ButtonLabel } from '@/components/button-label'

export const SelectedOptions = () => {
  const { selectedRows, reset } = useSelectedRows<Transaction>()

  const bulkDelete = useBulkDeleteTransactions()

  const isPending = bulkDelete.isPending

  const [ConfirmationDialog, confirm] = useConfirm(
    'Deseja realmente continuar?',
    'Você não poderá reverter a ação depois, perdendo essa informação.',
  )

  const handleBulkDelete = async () => {
    const ok = await confirm()
    if (ok) {
      const ids = selectedRows.map((r) => r.original.id)
      bulkDelete.mutate({ ids })
      reset()
    }
  }

  return (
    <>
      <ConfirmationDialog />
      {!!selectedRows.length && (
        <div className="flex flex-col">
          <Label className="text-xs text-muted-foreground mb-1 ml-1">
            Ações
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Ações ({selectedRows.length}
                )
                <ChevronDownIcon className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleBulkDelete}
                disabled={isPending}
                variant="destructive"
              >
                <TrashIcon className="size-4" />
                Excluir selecionados
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  )
}

export const ActionOptions = () => {
  const isMobile = useIsMobile()

  const { onOpen: onNewTransaction } = useNewTransaction()

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <ButtonLabel
        size={isMobile ? 'icon' : 'default'}
        hidden
        label="Criar"
        icon={ArrowLeftRightIcon}
        onClick={onNewTransaction}
      >
        {!isMobile && 'Adicionar'}
      </ButtonLabel>
    </div>
  )
}
