import { useCallback } from "react";
import "./App.css";
import { setBudget, useBudget, useBudgetTotal } from "./state/budget";
import { ExpensesByCategory } from "./components/ExpensesByType";
import {
  BudgetType,
  BudgetTypeMap,
  Expense,
  EXPENSE_TYPES,
  ExpenseType,
} from "./types";
import { formatMoney } from "./utils/formatMoney";
import { EditExpense } from "./components/EditExpense";
import { setExpense, useExpense } from "./state/expense";

// 1. show onboarding for new users
// 1. enter this month's income
// 1. pick budget allocation by type; percentages for giving, saving, spending (example: aggressive saver = 10% give, 50% save, 40% spend or balanced = 33% give, 33% save, 33% spend)
// 1. store in local storage
// 1. on load, sync with local storage
// 1. show checklist for getting HYS, HSA, 529s, automating emergency fund, debt, and retirement.

enum Status {
  ONBOARDING = "onboarding",
  NO_INCOME = "no_income",
  BUDGET = "budget",
}

const createDefaultExpense = (id: string): Expense => {
  return {
    id,
    amount: 0,
    title: "Untitled Expense",
    type: EXPENSE_TYPES.uncategorized,
  };
};

function App() {
  const expenseId = useExpense();

  const yearMonth = new Date().toISOString().slice(0, 7);
  const yearMonthHeading = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const budgetMonthKey = `budget-${yearMonth}`;

  const budget = useBudget(budgetMonthKey);
  const budgetTotal = useBudgetTotal();

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const income = parseInt(e.target.value, 10);
    setBudget({ ...budget, income });
  };

  const handleSelectBudgetType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as BudgetType;
    setBudget({ ...budget, type });
  };

  const handleAddExpense = () => {
    const id = String(Math.random());
    const newExpense = createDefaultExpense(id);
    setBudget({
      ...budget,
      expenses: [...budget.expenses, newExpense],
    });
    setExpense(newExpense);
  };

  const getStatus = (): Status => {
    if (!budget.income || budget.income <= 0) {
      return Status.NO_INCOME;
    }
    return Status.BUDGET;
  };

  const status: Status = getStatus();

  const handleSaveExpense = useCallback(() => {
    if (!expenseId) {
      alert(
        "Unxpected: No expense was update. No expense has been set to edit.",
      );
      return;
    }

    const newExpenses = [...budget.expenses];
    const expenseIndex = newExpenses.findIndex((exp) => expenseId === exp.id);

    if (expenseIndex === -1) {
      alert(
        `Unxpected: Couldn't save the changes to this expense: ID → ${expenseId}`,
      );
      return;
    }

    newExpenses[expenseIndex] = expenseId;

    setBudget({
      ...budget,
      expenses: newExpenses,
    });
  }, [budget, expenseId]);

  if (status === Status.NO_INCOME) {
    return (
      <>
        {/* <h2>Enter you monthly income</h2> */}
        <input
          value={budget.income}
          autoFocus
          onChange={handleIncomeChange}
          type="number"
        />
      </>
    );
  }

  const expenseTotal = budgetTotal;
  const leftToBudget = budget.income - expenseTotal;
  const formatLeftToBudget = formatMoney(leftToBudget);

  return (
    <>
      <h1>{yearMonthHeading}</h1>

      <div>
        <input
          value={budget.income}
          autoFocus
          onChange={handleIncomeChange}
          type="number"
        />
        {/* pick budget allocation by type */}
        <select value={budget.type} onChange={handleSelectBudgetType}>
          {Object.values(BudgetType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span>Add new expense: </span>
        <button onClick={handleAddExpense}>Add Expense</button>
      </div>

      {expenseId && (
        <EditExpense
          expense={expenseId}
          setExpense={setExpense}
          onClose={handleSaveExpense}
        />
      )}

      {/* then, enter an expense, category (give, save, spend) and cost $$ */}
      {/* then, show budget with option to add more expenses until all of budget is spent */}

      {/* show category headings and amount left in each category */}
      {Object.keys(EXPENSE_TYPES).map((expenseTypeKey) => {
        const expenseType = EXPENSE_TYPES[expenseTypeKey as ExpenseType];
        return (
          <ExpensesByCategory
            expenseType={expenseType}
            amountLimit={
              BudgetTypeMap[budget.type][expenseType] * 0.01 * budget.income
            }
            handleEditExpense={setExpense}
          />
        );
      })}

      {/* show amount left to spend */}
      <p>Left to budget: {formatLeftToBudget}</p>
      <pre>{JSON.stringify(budget, null, 2)}</pre>
    </>
  );
}

export default App;
