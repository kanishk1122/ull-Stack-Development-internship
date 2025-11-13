const createTable = `
CREATE TABLE IF NOT EXISTS ratings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, store_id)
);
`;

async function upsertRating(pool, { userId, storeId, rating }) {
  const query = `
    INSERT INTO ratings (user_id, store_id, rating)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, store_id)
    DO UPDATE SET rating = EXCLUDED.rating, created_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [userId, storeId, rating]);
  return rows[0];
}

module.exports = {
  createTable,
  upsertRating,
};
