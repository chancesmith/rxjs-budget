import { z } from "zod";

export enum BudgetType {
  LETHAL_SAVER = "LETHAL_SAVER",
  AGGRESSIVE_SAVER = "AGGRESSIVE_SAVER",
  BALANCED_SAVER = "BALANCED_SAVER",
  CONSERVATIVE_SAVER = "CONSERVATIVE_SAVER",
  LETHAL_SPENDER = "LETHAL_SPENDER",
}

type BudgetAllocation = Record<ExpenseType, number>;

export const BudgetTypeMap: Record<BudgetType, BudgetAllocation> = {
  [BudgetType.LETHAL_SAVER]: {
    uncategorized: 0,
    giving: 10,
    saving: 70,
    wants: 10,
    needs: 10,
  },
  [BudgetType.AGGRESSIVE_SAVER]: {
    uncategorized: 0,
    giving: 10,
    saving: 60,
    wants: 15,
    needs: 15,
  },
  [BudgetType.BALANCED_SAVER]: {
    uncategorized: 0,
    giving: 10,
    saving: 50,
    wants: 20,
    needs: 20,
  },
  [BudgetType.CONSERVATIVE_SAVER]: {
    uncategorized: 0,
    giving: 10,
    saving: 40,
    wants: 30,
    needs: 20,
  },
  [BudgetType.LETHAL_SPENDER]: {
    uncategorized: 0,
    giving: 10,
    saving: 10,
    wants: 40,
    needs: 40,
  },
};

export const EXPENSE_TYPES = {
  uncategorized: "uncategorized",
  giving: "giving",
  saving: "saving",
  wants: "wants",
  needs: "needs",
} as const;

export type ExpenseType = (typeof EXPENSE_TYPES)[keyof typeof EXPENSE_TYPES];

export type Expense = {
  id: string;
  type: ExpenseType;
  title: string;
  amount: number;
};

export type MonthlyBudget = {
  type: BudgetType;
  income: number;
  expenses: Expense[];
};

const expenseSchema = z.object({
  type: z.nativeEnum(EXPENSE_TYPES),
  title: z.string(),
  amount: z.number(),
});

export const budgetSchema = z.object({
  type: z.nativeEnum(BudgetType),
  income: z.number(),
  expenses: z.array(expenseSchema),
});
