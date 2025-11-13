// This file defines the database schema and provides functions to interact with it.

const user = require("./user");
const store = require("./store");
const rating = require("./rating");

async function _dangerouslyDropAndRecreateTables(pool) {
  console.warn("DANGER: Dropping and recreating all tables.");
  try {
    // Drop tables in reverse order of creation to avoid foreign key issues
    await pool.query("DROP TABLE IF EXISTS ratings;");
    await pool.query("DROP TABLE IF EXISTS stores;");
    await pool.query("DROP TABLE IF EXISTS users;");
    console.log("Tables dropped successfully.");
    // Re-initialize
    await init(pool);
  } catch (err) {
    console.error("Error during table drop/recreate:", err);
    throw err;
  }
}

async function init(pool) {
  console.log("Initializing database schema...");
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        address TEXT,
        role VARCHAR(20) NOT NULL CHECK (role IN ('USER', 'STORE_OWNER', 'ADMIN')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create stores table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        owner_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create ratings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, store_id)
      );
    `);

    console.log("Database schema initialized successfully.");
  } catch (err) {
    console.error("Error initializing database schema:", err);
    throw err;
  }
}

module.exports = {
  init,
  _dangerouslyDropAndRecreateTables,
  user,
  store,
  rating,
};
