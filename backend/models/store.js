const createTable = `
CREATE TABLE IF NOT EXISTS stores (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  email varchar(255),
  address varchar(400),
  owner_id int REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);
`;

async function insertStore(pool, { name, email, address, owner_id }) {
  const r = await pool.query(
    "INSERT INTO stores(name,email,address,owner_id) VALUES($1,$2,$3,$4) RETURNING *",
    [name, email, address, owner_id]
  );
  return r.rows[0];
}

async function getAllWithRatings(pool, userId = null) {
  const q = await pool.query(
    `
    SELECT s.*, COALESCE(avg(r.rating),0)::numeric(3,2) as "overallRating",
      (SELECT rating FROM ratings WHERE user_id = $1 AND store_id = s.id) as user_rating
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    GROUP BY s.id
    ORDER BY s.name ASC
  `,
    [userId]
  );
  return q.rows;
}

async function getAllStores(
  pool,
  { search, sortBy = "name", sortOrder = "ASC" } = {}
) {
  let query = `
    SELECT s.*, u.name as owner_name, COALESCE(avg(r.rating),0)::numeric(3,2) as "overallRating"
    FROM stores s
    LEFT JOIN users u ON s.owner_id = u.id
    LEFT JOIN ratings r ON r.store_id = s.id
    WHERE 1=1
  `;
  const params = [];
  let paramCount = 0;

  if (search) {
    paramCount++;
    query += ` AND (s.name ILIKE $${paramCount} OR s.email ILIKE $${paramCount} OR s.address ILIKE $${paramCount})`;
    params.push(`%${search}%`);
  }

  query += " GROUP BY s.id, u.name";

  const validSortColumns = ["name", "email", "address", "overallRating"];
  const validSortOrder = ["ASC", "DESC"];

  if (
    validSortColumns.includes(sortBy) &&
    validSortOrder.includes(sortOrder.toUpperCase())
  ) {
    query += ` ORDER BY s.${sortBy} ${sortOrder}`;
  }

  const r = await pool.query(query, params);
  return r.rows;
}

async function getStoresByOwner(pool, ownerId) {
  const r = await pool.query(
    `SELECT s.*, COALESCE(avg(r.rating),0)::numeric(3,2) as "overallRating"
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE s.owner_id = $1
     GROUP BY s.id`,
    [ownerId]
  );
  return r.rows;
}

async function getStoreRatings(pool, storeId) {
  const r = await pool.query(
    `SELECT r.*, u.name as user_name, u.email as user_email
     FROM ratings r
     JOIN users u ON r.user_id = u.id
     WHERE r.store_id = $1
     ORDER BY r.created_at DESC`,
    [storeId]
  );
  return r.rows;
}

module.exports = {
  createTable,
  insertStore,
  getAllWithRatings,
  getAllStores,
  getStoresByOwner,
  getStoreRatings,
};
