import { budgetSchema, MonthlyBudget } from "../types";

export function getLocalStorageBudget({
  budgetMonthKey,
}: {
  budgetMonthKey: string;
}): MonthlyBudget | null {
  const budget = localStorage.getItem(budgetMonthKey);
  if (!budget) {
    console.log("Starting new budget");
    return null;
  }

  try {
    const parsedBudget = JSON.parse(budget);
    const safeParsedBudget = budgetSchema.safeParse(parsedBudget);
    if (!safeParsedBudget.success) {
      console.error("Error parsing budget", safeParsedBudget.error);
      return null;
    }
    return safeParsedBudget.data;
  } catch (error) {
    console.error("Error parsing budget", error);
    return null;
  }
}
