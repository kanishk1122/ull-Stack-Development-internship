const createTable = `
CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  name varchar(60) NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  password varchar(255) NOT NULL,
  address varchar(400),
  role varchar(32) default 'user',
  created_at timestamptz DEFAULT now()
);
`;

async function createUser(
  pool,
  { name, email, passwordHash, address, role = "user" }
) {
  const r = await pool.query(
    "INSERT INTO users(name,email,password,address,role) VALUES($1,$2,$3,$4,$5) RETURNING id,email,name,role,address,created_at",
    [name, email, passwordHash, address, role]
  );
  return r.rows[0];
}

async function findByEmail(pool, email) {
  const r = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  return r.rows[0];
}

async function findById(pool, id) {
  const r = await pool.query(
    "SELECT id,name,email,address,role,created_at FROM users WHERE id=$1",
    [id]
  );
  return r.rows[0];
}

async function getAllUsers(
  pool,
  { role, search, sortBy = "name", sortOrder = "ASC" } = {}
) {
  let query =
    "SELECT id,name,email,address,role,created_at FROM users WHERE 1=1";
  const params = [];
  let paramCount = 0;

  if (role) {
    paramCount++;
    query += ` AND role = $${paramCount}`;
    params.push(role);
  }

  if (search) {
    paramCount++;
    query += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR address ILIKE $${paramCount})`;
    params.push(`%${search}%`);
  }

  const validSortColumns = ["name", "email", "role", "created_at"];
  const validSortOrder = ["ASC", "DESC"];

  if (
    validSortColumns.includes(sortBy) &&
    validSortOrder.includes(sortOrder.toUpperCase())
  ) {
    query += ` ORDER BY ${sortBy} ${sortOrder}`;
  }

  const r = await pool.query(query, params);
  return r.rows;
}

async function updatePassword(pool, userId, passwordHash) {
  await pool.query("UPDATE users SET password=$1 WHERE id=$2", [
    passwordHash,
    userId,
  ]);
  return true;
}

module.exports = {
  createTable,
  createUser,
  findByEmail,
  findById,
  getAllUsers,
  updatePassword,
};
