import { z } from 'zod'

export const filterSchema = z.object({
  to: z.string().optional(),
  from: z.string().optional(),
  billingId: z.string().optional(),
  // open: z.string().optional(),
  rangeValue: z.string().optional(),
})

export type FilterFormValues = z.infer<typeof filterSchema>

export const filterDefaultValues: FilterFormValues = {
  to: undefined,
  from: undefined,
  billingId: undefined,
  // open: FILTER_BOOL_STATUS[0].value,
  rangeValue: 'CUSTOM',
}
