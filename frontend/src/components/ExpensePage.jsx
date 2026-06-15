import { useEffect, useState } from 'react';
import { fetchAllExpenses } from '../adapters/expense-adapters';
import AddExpenseForm from './AddExpenseForm';
import SummaryCards from './SummaryCards';
import ExpenseList from './ExpenseList';

function ExpensePage({ currentUser }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadExpenses = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchAllExpenses();
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <section>
      <h1 className="dashboard-greeting">
        {getGreeting()}, {currentUser.username}.
      </h1>

      <SummaryCards expenses={expenses} />

      <AddExpenseForm loadExpenses={loadExpenses} />

      {isLoading && <p style={{ color: 'var(--text-2)', fontSize: '0.875rem' }}>Loading...</p>}
      {error && <p className="error-msg">Something went wrong: {error}</p>}

      <ExpenseList expenses={expenses} loadExpenses={loadExpenses} />
    </section>
  );
}

export default ExpensePage;
