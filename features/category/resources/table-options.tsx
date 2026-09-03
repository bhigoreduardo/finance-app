import { BanIcon, ChevronDownIcon, GroupIcon, TrashIcon } from 'lucide-react'

import { type Category } from '@/features/category/api/use-get-categories'

import { useConfirm } from '@/hooks/use-confirm'
import { useIsMobile } from '@/hooks/use-mobile'
import { useSelectedRows } from '@/hooks/use-selected-rows'
import { useNewCategory } from '@/features/category/hooks/use-new-category'
import { useBulkDeleteCategories } from '@/features/category/api/use-bulk-delete-categories'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ButtonLabel } from '@/components/button-label'

export const SelectedOptions = () => {
  const { selectedRows, reset } = useSelectedRows<Category>()

  const bulkDelete = useBulkDeleteCategories()

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

  const { onOpen: onNewCategory } = useNewCategory()

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <ButtonLabel
        size={isMobile ? 'icon' : 'default'}
        hidden
        label="Criar"
        icon={GroupIcon}
        onClick={onNewCategory}
      >
        {!isMobile && 'Adicionar'}
      </ButtonLabel>
    </div>
  )
}
