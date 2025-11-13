const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");

module.exports = (pool) => {
  // Middleware to check if user is a store owner
  const isOwner = (req, res, next) => {
    if (req.user.role !== "STORE_OWNER") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };

  router.get("/dashboard", authMiddleware, isOwner, async (req, res) => {
    const ownerId = req.user.id;

    try {
      // Get store info and average rating
      const storeRes = await pool.query(
        `SELECT s.id, s.name, s.address, COALESCE(AVG(r.rating), 0) as "averageRating"
         FROM stores s
         LEFT JOIN ratings r ON s.id = r.store_id
         WHERE s.owner_id = $1
         GROUP BY s.id`,
        [ownerId]
      );

      if (storeRes.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Store not found for this owner." });
      }

      const store = storeRes.rows[0];

      // Get users who rated the store
      const ratingsRes = await pool.query(
        `SELECT u.name, u.email, r.rating
         FROM ratings r
         JOIN users u ON r.user_id = u.id
         WHERE r.store_id = $1
         ORDER BY r.created_at DESC`,
        [store.id]
      );

      res.json({
        store,
        ratings: ratingsRes.rows,
      });
    } catch (error) {
      console.error("Error fetching owner dashboard:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};
