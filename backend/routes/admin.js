const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { authMiddleware } = require("../middleware/auth");

module.exports = (pool) => {
  // Middleware to check for admin role
  const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
  };

  router.use(authMiddleware, isAdmin);

  // GET /api/admin/stats
  router.get("/stats", async (req, res) => {
    try {
      const users = await pool.query("SELECT COUNT(*) FROM users");
      const stores = await pool.query("SELECT COUNT(*) FROM stores");
      const ratings = await pool.query("SELECT COUNT(*) FROM ratings");
      res.json({
        totalUsers: parseInt(users.rows[0].count, 10),
        totalStores: parseInt(stores.rows[0].count, 10),
        totalRatings: parseInt(ratings.rows[0].count, 10),
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // GET /api/admin/users
  router.get("/users", async (req, res) => {
    // Basic implementation without filters for now
    const { rows } = await pool.query(
      "SELECT id, name, email, address, role FROM users ORDER BY name"
    );
    res.json(rows);
  });

  // POST /api/admin/users
  router.post("/users", async (req, res) => {
    const { name, email, password, address, role } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const { rows } = await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role",
      [name, email, hashedPassword, address, role]
    );
    res.status(201).json(rows[0]);
  });

  // POST /api/admin/stores
  router.post("/stores", async (req, res) => {
    const { name, address, ownerId } = req.body;
    try {
      const { rows } = await pool.query(
        "INSERT INTO stores (name, address, owner_id) VALUES ($1, $2, $3) RETURNING *",
        [name, address, ownerId]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error("Error creating store:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // GET /api/admin/stores
  router.get("/stores", async (req, res) => {
    const { rows } = await pool.query(`
      SELECT s.id, s.name, s.address, u.email as "ownerEmail", COALESCE(AVG(r.rating), 0) as "overallRating"
      FROM stores s
      LEFT JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id, u.email
      ORDER BY s.name
    `);
    res.json(rows);
  });

  return router;
};
