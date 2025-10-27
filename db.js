require('dotenv').config();
const pgp = require('pg-promise')();

const db = pgp({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5434,
  database: process.env.DB_NAME || 'books_app',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1234'
});

// Initialize table if not exists
(async () => {
  await db.none(`
    CREATE TABLE IF NOT EXISTS wishlist (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      authors TEXT,
      thumbnail TEXT,
      rating NUMERIC,
      ratings_count INTEGER
    );
  `);
})();

module.exports = db;
