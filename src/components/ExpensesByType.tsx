import { useExpenses } from "../state/budget";
import { Expense, EXPENSE_TYPES, ExpenseType } from "../types";
import { formatMoney } from "../utils/formatMoney";
import { Expense as ExpenseComponent } from "./Expense";

type Props = {
  amountLimit: number;
  expenseType: ExpenseType;
  handleEditExpense: (expense: Expense) => void;
};

export const ExpensesByCategory = ({
  amountLimit,
  expenseType,
  handleEditExpense,
}: Props) => {
  const expensesByType = useExpenses(expenseType);

  const totalSpent = expensesByType.reduce(
    (acc, expense) => acc + expense.amount,
    0,
  );
  const formatedTotalSpent = formatMoney(totalSpent);
  const expenseTypeLimit = formatMoney(amountLimit);

  const hasExceededLimit = totalSpent > amountLimit;

  return (
    <>
      {expenseType === EXPENSE_TYPES.uncategorized &&
        expensesByType.length > 0 && (
          <p>
            🔴 You have {expensesByType.length} expense(s) in MISC that should
            be catgorized.
          </p>
        )}

      <div style={$heading}>
        <h2>{expenseType}</h2>
        <span>
          {formatedTotalSpent} ({expenseTypeLimit} {hasExceededLimit && "🔴"})
        </span>
      </div>
      <ul>
        {expensesByType.map((expense) => (
          <ExpenseComponent
            key={expense.id}
            id={expense.id}
            onClick={handleEditExpense}
          />
        ))}
      </ul>
    </>
  );
};

const $heading = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #ccc",
  marginBottom: "10px",
};
