import { useEffect, useState } from 'react';
import { fetchAllExpenses } from '../adapters/expense-adapters';
import AddExpenseForm from './AddExpenseForm';
import ExpenseList from './ExpenseList';

function ExpensePage({ currentUser, handleLogout }) {
  const [expenses, setExpenses] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  const loadExpenses = async () => {
    setIsLoading(true);

    setError(null);

    const { data, error: fetchError } =
      await fetchAllExpenses();

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setExpenses(data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  return (
    <section>
      <div id="user-controls">
        <span>
          Welcome,{' '}
          <strong>{currentUser.username}</strong>!
        </span>

        <button onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <AddExpenseForm loadExpenses={loadExpenses} />

      {isLoading && <p>Loading expenses...</p>}

      {error && (
        <p className="error">
          Something went wrong: {error}
        </p>
      )}

      <ExpenseList
        expenses={expenses}
        loadExpenses={loadExpenses}
      />
    </section>
  );
}

export default ExpensePage;
