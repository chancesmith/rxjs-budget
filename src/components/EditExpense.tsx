import { Expense, EXPENSE_TYPES, ExpenseType } from "../types";

type Props = {
  expense: Expense;
  setExpense: (expense: Expense) => void;
  onClose: () => void;
};

export const EditExpense = ({ expense, setExpense, onClose }: Props) => {
  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setExpense({ ...expense, title });
  }

  function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const type = e.target.value as ExpenseType;
    setExpense({ ...expense, type });
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const amount = parseInt(e.target.value, 10);
    setExpense({ ...expense, amount });
  }

  function handleClose() {
    onClose();
  }

  return (
    <div>
      <h2>Edit Expense</h2>
      <div>
        <fieldset>
          <label>Name:</label>
          <input value={expense.title} onChange={handleTitleChange} />
        </fieldset>

        <fieldset>
          <label>Type:</label>
          <select value={expense.type} onChange={handleTypeChange}>
            {Object.values(EXPENSE_TYPES).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset>
          <label>Amount:</label>
          <input
            value={expense.amount}
            onChange={handleAmountChange}
            type="number"
          />
        </fieldset>

        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};
