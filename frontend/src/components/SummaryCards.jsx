function SummaryCards({ expenses }) {
  const now = new Date();

  const thisMonthTotal = expenses
    .filter((e) => {
      const d = new Date(e.expense_date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const topCategory = (() => {
    const totals = {};
    expenses.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + Number(e.amount);
    });
    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || '—';
  })();

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <p className="summary-label">Spent This Month</p>
        <p className="summary-value">${thisMonthTotal.toFixed(2)}</p>
      </div>
      <div className="summary-card">
        <p className="summary-label">Top Category</p>
        <p className="summary-value">{topCategory}</p>
      </div>
      <div className="summary-card">
        <p className="summary-label">Transactions</p>
        <p className="summary-value">{expenses.length}</p>
      </div>
    </div>
  );
}

export default SummaryCards;
