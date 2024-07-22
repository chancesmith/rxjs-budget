import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { startWith, scan, tap, map, Observable } from "rxjs";
import { MonthlyBudget, BudgetType, ExpenseType } from "../types";
import { getLocalStorageBudget } from "../utils/getLocalStorageBudget";

const INITIAL_BUDGET: MonthlyBudget = {
  type: BudgetType.AGGRESSIVE_SAVER,
  income: 0,
  expenses: [],
};

const [budgetChange$, setBudget] = createSignal<MonthlyBudget>();

const [useBudget] = bind((localStorageKey: string) => {
  const budget = getLocalStorageBudget({ budgetMonthKey: localStorageKey });
  if (!budget) {
    return budgetChange$;
  }
  return budgetChange$.pipe(
    startWith(budget),
    scan((prev, next) => ({ ...prev, ...next })),
    tap((budget) => {
      console.log("Saving budget");
      localStorage.setItem(localStorageKey, JSON.stringify(budget));
    }),
  );
}, INITIAL_BUDGET);

const budgetTotal$: Observable<number> = budgetChange$.pipe(
  map((budget) =>
    budget.expenses.reduce((total, expense) => total + expense.amount, 0),
  ),
);

const [useBudgetTotal] = bind<number>(budgetTotal$, 0);

// stream for each expense type
const [useExpenses] = bind((expenseType: ExpenseType) => {
  return budgetChange$.pipe(
    map((budget) =>
      budget.expenses.filter((expense) => expense.type === expenseType),
    ),
  );
}, []);

// stream for expense by ID
const [useExpense] = bind((expenseId: string) => {
  return budgetChange$.pipe(
    map((budget) =>
      budget.expenses.find((expense) => expense.id === expenseId),
    ),
  );
}, undefined);

export {
  useBudget,
  setBudget,
  budgetChange$,
  useExpenses,
  useBudgetTotal,
  useExpense,
};
