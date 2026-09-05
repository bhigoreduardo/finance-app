import {
  PlusIcon,
  TrashIcon,
  UploadIcon,
  ChevronDownIcon,
  ArrowLeftRightIcon,
} from 'lucide-react'
import { useCSVReader } from 'react-papaparse'

import { type Transaction } from '@/features/transaction/api/use-get-transactions'

import {
  type INITIAL_IMPORT,
  useNewTransaction,
} from '@/features/transaction/hooks/use-new-transaction'
import { useConfirm } from '@/hooks/use-confirm'
import { useIsMobile } from '@/hooks/use-mobile'
import { useSelectedRows } from '@/hooks/use-selected-rows'
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
  const { CSVReader } = useCSVReader()

  const { onOpen: onNewTransaction, onChange } = useNewTransaction()

  const onUpload = (results: INITIAL_IMPORT) => {
    console.log({ results })
    onChange('IMPORT', results)
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <CSVReader onUploadAccepted={onUpload}>
        {({ getRootProps }: any) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ButtonLabel
                size={isMobile ? 'icon' : 'default'}
                hidden
                label="Criar"
                icon={ArrowLeftRightIcon}
              >
                {!isMobile && 'Adicionar'}
              </ButtonLabel>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onNewTransaction}>
                <PlusIcon className="size-4" />
                Novo
              </DropdownMenuItem>
              <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                <div className="flex items-center gap-2" {...getRootProps()}>
                  <UploadIcon className="size-4" />
                  Importar
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CSVReader>
    </div>
  )
}
