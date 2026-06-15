import { useState, useMemo } from 'react';
import ExpenseItem from './ExpenseItem';

function ExpenseList({ expenses, loadExpenses }) {
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState({ key: 'expense_date', dir: 'desc' });

  const handleSort = (key) => {
    setSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc',
    }));
  };

  const displayed = useMemo(() => {
    let list = expenses;
    if (filter) {
      const q = filter.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      let aVal = a[sort.key];
      let bVal = b[sort.key];
      if (sort.key === 'amount') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }
      if (aVal < bVal) return sort.dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [expenses, filter, sort]);

  const ColHeader = ({ label, colKey }) => {
    const isActive = sort.key === colKey;
    return (
      <button className={`col-header${isActive ? ' active' : ''}`} onClick={() => handleSort(colKey)}>
        {label}
        <span className="sort-icon">
          {isActive ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
        </span>
      </button>
    );
  };

  return (
    <div className="expense-card">
      <div className="expense-card-header">
        <h2>Recent Transactions</h2>
        <input
          className="filter-input"
          type="text"
          placeholder="Search name or category…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="expense-table-header">
        <ColHeader label="Name" colKey="title" />
        <ColHeader label="Amount" colKey="amount" />
        <ColHeader label="Category" colKey="category" />
        <ColHeader label="Date" colKey="expense_date" />
        <span></span>
        <span></span>
      </div>
      <ul id="expense-list">
        {displayed.length === 0 ? (
          <li className="expense-empty">No transactions found.</li>
        ) : (
          displayed.map((expense) => (
            <ExpenseItem
              key={expense.expense_id}
              expense={expense}
              loadExpenses={loadExpenses}
            />
          ))
        )}
      </ul>
    </div>
  );
}

export default ExpenseList;
