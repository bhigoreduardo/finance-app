import { z } from 'zod'

export const insertBillingSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
})

export type InsertBillingFormValues = z.infer<typeof insertBillingSchema>

export const insertBillingDefaultValues: InsertBillingFormValues = {
  name: '',
}
