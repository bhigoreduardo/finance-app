import { z } from 'zod'

export const insertTransactionSchema = z.object({
  amount: z.number(),
  description: z.string().nullish(),
  dueDate: z.coerce.date().nullish(),

  billingId: z.string().nullish(),
  categoryId: z.string().nullish(),
})

export const insertTransactionFormSchema = insertTransactionSchema.extend({
  amount: z.string().min(1, { message: 'Valor é obrigatório' }),
})

export type InsertTransactionFormValues = z.infer<
  typeof insertTransactionFormSchema
>

export const insertTransactionDefaultValues: InsertTransactionFormValues = {
  amount: '',
  description: '',
  dueDate: null,

  billingId: null,
  categoryId: null,
}
