import { useState } from 'react';
import { updateExpense, deleteExpense } from '../adapters/expense-adapters';

function ExpenseItem({ expense, loadExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: expense.title,
    amount: expense.amount,
    category: expense.category,
    expense_date: expense.expense_date?.split('T')[0],
  });

  const handleDelete = async () => {
    const { error } = await deleteExpense(expense.expense_id);
    if (error) return console.error(error);
    loadExpenses();
  };

  const handleSave = async () => {
    const { error } = await updateExpense(expense.expense_id, formData);
    if (error) return console.error(error);
    setIsEditing(false);
    loadExpenses();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isEditing) {
    return (
      <li className="expense-item editing">
        <div className="editing-grid">
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} />
          <input type="text" name="category" value={formData.category} onChange={handleChange} />
          <input type="date" name="expense_date" value={formData.expense_date} onChange={handleChange} />
          <div className="edit-buttons">
            <button className="btn-save" onClick={handleSave}>Save</button>
            <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="expense-item">
      <div className="expense-title">
        <strong>{expense.title}</strong>
      </div>
      <div className="expense-amount">
        ${Number(expense.amount).toFixed(2)}
      </div>
      <div className="expense-category">
        <span className="category-badge">{expense.category}</span>
      </div>
      <div className="expense-date">
        {new Date(expense.expense_date).toLocaleDateString()}
      </div>
      <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit</button>
      <button className="btn-delete" onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default ExpenseItem;
