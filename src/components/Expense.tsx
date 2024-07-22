import { useExpense } from "../state/budget";
import { formatMoney } from "../utils/formatMoney";
import { Expense as ExpenseObject } from "../types";

type Props = {
  id: string;
  onClick: (expense: ExpenseObject) => void;
};

export const Expense = ({ id, onClick }: Props) => {
  const expense = useExpense(id);

  if (!expense) return <p>Oops! Expense not found: {id}</p>;

  const handleClick = () => {
    onClick(expense);
  };

  return (
    <li onClick={handleClick}>
      {expense.title}: {formatMoney(expense.amount)}
    </li>
  );
};
