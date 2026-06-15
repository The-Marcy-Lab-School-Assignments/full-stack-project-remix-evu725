import { useEffect, useState, useMemo } from 'react';
import { fetchAllExpenses } from '../adapters/expense-adapters';

function ReportPage() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllExpenses().then(({ data }) => {
      if (data) setExpenses(data);
      setIsLoading(false);
    });
  }, []);

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const avgTransaction = expenses.length ? totalSpent / expenses.length : 0;

  const monthlyData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const total = expenses
        .filter((e) => {
          const ed = new Date(e.expense_date);
          return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
        })
        .reduce((sum, e) => sum + Number(e.amount), 0);
      return {
        month: d.toLocaleString('default', { month: 'short' }),
        total,
      };
    });
  }, [expenses]);

  const categoryData = useMemo(() => {
    const totals = {};
    expenses.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + Number(e.amount);
    });
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
      }));
  }, [expenses, totalSpent]);

  const maxMonthly = Math.max(...monthlyData.map((m) => m.total), 1);

  if (isLoading) return <p style={{ color: 'var(--text-2)', fontSize: '0.875rem' }}>Loading...</p>;

  return (
    <section>
      <h1 className="dashboard-greeting">Reports</h1>

      <div className="summary-cards">
        <div className="summary-card">
          <p className="summary-label">Total Spent</p>
          <p className="summary-value">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <p className="summary-label">Avg per Transaction</p>
          <p className="summary-value">${avgTransaction.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <p className="summary-label">Categories</p>
          <p className="summary-value">{categoryData.length}</p>
        </div>
      </div>

      <div className="report-card">
        <div className="report-card-header">
          <h2>Monthly Spending</h2>
          <span className="report-subtitle">Last 6 months</span>
        </div>
        <div className="monthly-chart">
          {monthlyData.map((m, i) => (
            <div key={i} className="chart-col">
              <span className="chart-amount">
                {m.total > 0 ? `$${m.total.toFixed(0)}` : ''}
              </span>
              <div className="chart-bar-wrap">
                <div
                  className="chart-bar"
                  style={{ height: `${(m.total / maxMonthly) * 100}%` }}
                />
              </div>
              <span className="chart-label">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="report-card">
        <div className="report-card-header">
          <h2>Spending by Category</h2>
        </div>
        {categoryData.length === 0 ? (
          <p className="expense-empty">No data yet.</p>
        ) : (
          <div className="category-list">
            {categoryData.map(({ category, amount, percentage }) => (
              <div key={category} className="category-row">
                <span className="category-badge">{category}</span>
                <div className="category-bar-track">
                  <div
                    className="category-bar-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="category-row-pct">{percentage}%</span>
                <span className="category-row-amount">${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ReportPage;
