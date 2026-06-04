import { createExpense } from '../adapters/expense-adapters';

function AddExpenseForm({ loadExpenses }) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const expense = {
      title: form.title.value,
      amount: Number(form.amount.value),
      category: form.category.value,
      expense_date: form.expense_date.value,
    };

    // validation
    if (
      !expense.title ||
      !expense.amount ||
      !expense.category ||
      !expense.expense_date
    ) {
      console.error('All fields are required.');
      return;
    }

    console.log(expense);

    const { error } = await createExpense(expense);

    if (error) {
      console.error(error);
      return;
    }

    await loadExpenses();
    form.reset();
  };

  return (
    <form id="add-expense-form" onSubmit={handleSubmit}>
      <h2>Add Expense</h2>

      <input
        type="text"
        name="title"
        placeholder="Expense title"
        required
      />

      <input
        type="number"
        step="0.01"
        name="amount"
        placeholder="Amount"
        required
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        required
      />

      <input
        type="date"
        name="expense_date"
        required
      />

      <button type="submit">
        Add Expense
      </button>
    </form>
  );
}

export default AddExpenseForm;
