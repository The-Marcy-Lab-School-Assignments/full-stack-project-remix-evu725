const pool = require('../db/pool');

// Return all expenses from specific user
module.exports.listByUser = async (user_id) => {
    const query =  'SELECT * FROM expenses WHERE user_id = $1 ORDER BY expense_id ASC';
    const { rows } = await pool.query(query, [user_id]);
    return rows;
}

// Returns a single expense row (used for ownership before update/delete)
module.exports.find = async (expense_id) => {
    const query = 'SELECT * FROM expenses WHERE expense_id = $1';
    const { rows } = await pool.query(query, [expense_id]);
    return rows[0] || null;
}

// Creates a new expense returns the full expenses row
module.exports.create = async (title, amount, category, expense_date, user_id) => {
    const query = 'INSERT INTO expenses (title, amount, category, expense_date, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const { rows } = await pool.query(query, [title, amount, category, expense_date, user_id]);
    return rows[0];
}

// Updates an expense and returns the updated row.
module.exports.update = async (title, amount, category, expense_date, expense_id) => {
    const query = 'UPDATE expenses SET title = $1, amount = $2, category = $3, expense_date = $4 WHERE expense_id = $5 RETURNING *';
    const { rows } = await pool.query(query, [title, amount, category, expense_date, expense_id]);
    return rows[0];
}

// Deletes an expense by id
module.exports.destroy = async (expense_id) => {
    const query = 'DELETE FROM expenses WHERE expense_id = $1 RETURNING *';
    const { rows } = await pool.query(query, [expense_id]);
    return rows[0] || null;
}
