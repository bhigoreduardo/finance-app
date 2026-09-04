import { Hono } from 'hono'
import { Prisma } from '@prisma/client'
import { parse, subDays, differenceInDays } from 'date-fns'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'

import { db } from '@/lib/db'
import { calculatePercentageChange, fillMissingDays } from '@/lib/utils'

import { filterSchema } from '@/features/summary/schema'
import { userAuthenticate } from '@/middlewares/user-authenticate'

type PeriodAggregate = {
  income: number
  expenses: number
  remaining: number
}

type CategoryItem = {
  name: string
  value: number
}

type DayItem = {
  date: string
  income: number
  expenses: number
}

type SummaryResult = {
  result: {
    currentPeriod: PeriodAggregate
    lastPeriod: PeriodAggregate
    categories: CategoryItem[]
    days: DayItem[]
  }
}

const app = new Hono().get(
  '/',
  verifyAuth(),
  userAuthenticate(),
  zValidator('query', filterSchema),
  async (c) => {
    const { authId } = c.get('userAuthenticate')
    const { from, to, billingId } = c.req.valid('query')

    const defaultTo = new Date()
    const defaultFrom = subDays(defaultTo, 30)

    const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom
    const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo

    const periodLength = differenceInDays(endDate, startDate) + 1
    const lastPeriodStart = subDays(startDate, periodLength)
    const lastPeriodEnd = subDays(endDate, periodLength)

    const billingFilter = billingId
      ? Prisma.sql`AND t."billingId" = ${billingId}`
      : Prisma.empty

    const result = await db.$queryRaw<SummaryResult[]>`
      WITH
        current_period AS (
          SELECT
            COALESCE(SUM(CASE WHEN t.amount >= 0 THEN t.amount ELSE 0 END), 0)::float AS income,
            COALESCE(SUM(CASE WHEN t.amount < 0 THEN t.amount ELSE 0 END), 0)::float AS expenses,
            COALESCE(SUM(t.amount), 0)::float AS remaining
          FROM "Transaction" t
          WHERE t."userId" = ${authId}
            AND t."createdAt" >= ${startDate}
            AND t."createdAt" <= ${endDate}
            ${billingFilter}
        ),

        last_period AS (
          SELECT
            COALESCE(SUM(CASE WHEN t.amount >= 0 THEN t.amount ELSE 0 END), 0)::float AS income,
            COALESCE(SUM(CASE WHEN t.amount < 0 THEN t.amount ELSE 0 END), 0)::float AS expenses,
            COALESCE(SUM(t.amount), 0)::float AS remaining
          FROM "Transaction" t
          WHERE t."userId" = ${authId}
            AND t."createdAt" >= ${lastPeriodStart}
            AND t."createdAt" <= ${lastPeriodEnd}
            ${billingFilter}
        ),

        category_breakdown AS (
          SELECT
            c.name AS name,
            SUM(ABS(t.amount))::float AS value
          FROM "Transaction" t
          JOIN "Category" c ON c.id = t."categoryId"
          WHERE t."userId" = ${authId}
            AND t.amount < 0
            AND t."createdAt" >= ${startDate}
            AND t."createdAt" <= ${endDate}
            ${billingFilter}
          GROUP BY c.name
          ORDER BY SUM(ABS(t.amount)) DESC
        ),

        daily_summary AS (
          SELECT
            TO_CHAR(DATE(t."createdAt"), 'YYYY-MM-DD') AS date,
            COALESCE(SUM(CASE WHEN t.amount >= 0 THEN t.amount ELSE 0 END), 0)::float AS income,
            COALESCE(SUM(CASE WHEN t.amount < 0 THEN ABS(t.amount) ELSE 0 END), 0)::float AS expenses
          FROM "Transaction" t
          WHERE t."userId" = ${authId}
            AND t."createdAt" >= ${startDate}
            AND t."createdAt" <= ${endDate}
            ${billingFilter}
          GROUP BY DATE(t."createdAt")
          ORDER BY DATE(t."createdAt")
        )

      SELECT jsonb_build_object(
        'currentPeriod', COALESCE(
          (SELECT to_jsonb(cp) FROM current_period cp),
          jsonb_build_object('income', 0, 'expenses', 0, 'remaining', 0)
        ),
        'lastPeriod', COALESCE(
          (SELECT to_jsonb(lp) FROM last_period lp),
          jsonb_build_object('income', 0, 'expenses', 0, 'remaining', 0)
        ),
        'categories', COALESCE(
          (SELECT jsonb_agg(to_jsonb(cb)) FROM category_breakdown cb),
          '[]'::jsonb
        ),
        'days', COALESCE(
          (SELECT jsonb_agg(to_jsonb(ds)) FROM daily_summary ds),
          '[]'::jsonb
        )
      ) AS result
    `

    const { currentPeriod, lastPeriod, categories, days } = result[0].result

    const incomeChange = calculatePercentageChange(
      currentPeriod.income,
      lastPeriod.income,
    )
    const expensesChange = calculatePercentageChange(
      currentPeriod.expenses,
      lastPeriod.expenses,
    )
    const remainingChange = calculatePercentageChange(
      currentPeriod.remaining,
      lastPeriod.remaining,
    )

    const topCategories = categories.slice(0, 3)
    const otherCategories = categories.slice(3)
    const otherSum = otherCategories.reduce(
      (sum, current) => sum + current.value,
      0,
    )

    const finalCategories = topCategories
    if (otherCategories.length > 0) {
      finalCategories.push({ name: 'other', value: otherSum })
    }

    const filledDays = fillMissingDays(days, startDate, endDate)

    return c.json({
      data: {
        remainingAmount: currentPeriod.remaining,
        remainingChange,
        incomeAmount: currentPeriod.income,
        incomeChange,
        expensesAmount: currentPeriod.expenses,
        expensesChange,
        categories: finalCategories,
        days: filledDays,
      },
    })
  },
)

export default app
