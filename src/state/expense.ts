import { createSignal } from "@react-rxjs/utils";
import { Expense } from "../types";
import { bind } from "@react-rxjs/core";

const [expense$, setExpense] = createSignal<Expense | null>();

const [useExpense] = bind(expense$, null);

export { expense$, setExpense, useExpense };
