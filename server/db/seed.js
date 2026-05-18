const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
  // Drop tables in reverse dependency order (expenses references users via FK)
  await pool.query('DROP TABLE IF EXISTS expenses');
  await pool.query('DROP TABLE IF EXISTS users');

  await pool.query(`
    CREATE TABLE users (
      user_id       SERIAL PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE expenses (
      expense_id     SERIAL PRIMARY KEY,
      title          TEXT NOT NULL,
      amount         NUMERIC(10,2) NOT NULL,
      category       TEXT NOT NULL,
      expense_date   DATE NOT NULL DEFAULT CURRENT_DATE,
      user_id        INT REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  // Hash passwords in parallel — bcrypt is slow by design (CPU-bound hashing)
  const [aliceHash, bobHash, liamHash] = await Promise.all([
    bcrypt.hash('password123', SALT_ROUNDS),
    bcrypt.hash('password123', SALT_ROUNDS),
    bcrypt.hash('password123', SALT_ROUNDS),
  ]);

  // RETURNING captures inserted user_ids so we don't hardcode them
  const { rows: users } = await pool.query(`
    INSERT INTO users (username, password_hash) VALUES
      ('alice', $1),
      ('bob',   $2),
      ('liam',  $3)
    RETURNING user_id, username
  `, [aliceHash, bobHash, liamHash]);

  const [alice, bob, liam] = users;

  await pool.query(`
    INSERT INTO expenses (title, amount, category, expense_date, user_id)
    VALUES
      -- Alice expenses
      ('Groceries at Walmart', 54.23, 'Food', '2026-05-10', $1),
      ('Uber ride', 18.75, 'Transport', '2026-05-11', $1),
      ('Netflix subscription', 15.99, 'Entertainment', '2026-05-01', $1),

      -- Bob expenses
      ('Coffee', 5.50, 'Food', '2026-05-12', $2),
      ('Gas refill', 40.00, 'Transport', '2026-05-09', $2),
      ('Amazon purchase', 89.99, 'Shopping', '2026-05-08', $2),

      -- Liam expenses
      ('Lunch', 12.30, 'Food', '2026-05-13', $3),
      ('Gym membership', 29.99, 'Health', '2026-05-01', $3),
      ('Movie ticket', 14.00, 'Entertainment', '2026-05-07', $3)
  `, [alice.user_id, bob.user_id, liam.user_id]);

  return users;
};

seed()
  .then((users) => {
    console.log('Database seeded successfully.');
    console.log(`  Users: ${users.map((u) => u.username).join(', ')}`);
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  })
  .finally(() => pool.end());
