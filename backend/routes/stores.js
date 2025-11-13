const express = require("express");
const { authMiddleware, optionalAuth } = require("../middleware/auth");
const requireRole = require("../middleware/role");
const router = express.Router();

module.exports = (pool, models) => {
  // Get all stores for public (with optional user ratings)
  router.get("/", optionalAuth, async (req, res) => {
    const userId = req.user ? req.user.id : null;
    const rows = await models.store.getAllWithRatings(pool, userId);
    res.json(rows);
  });

  // Get all stores for admin (with filters and sorting)
  router.get(
    "/admin/list",
    authMiddleware,
    requireRole("admin"),
    async (req, res) => {
      const { search, sortBy, sortOrder } = req.query;
      try {
        const stores = await models.store.getAllStores(pool, {
          search,
          sortBy,
          sortOrder,
        });
        res.json(stores);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching stores" });
      }
    }
  );

  // Get store owner's stores
  router.get(
    "/owner",
    authMiddleware,
    requireRole("store_owner"),
    async (req, res) => {
      try {
        const stores = await models.store.getStoresByOwner(pool, req.user.id);
        res.json(stores);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching stores" });
      }
    }
  );

  // Get ratings for a specific store (store owner)
  router.get("/:id/ratings", authMiddleware, async (req, res) => {
    try {
      // Verify ownership if store_owner
      if (req.user.role === "store_owner") {
        const stores = await models.store.getStoresByOwner(pool, req.user.id);
        const ownsStore = stores.some((s) => s.id === parseInt(req.params.id));
        if (!ownsStore && req.user.role !== "admin") {
          return res.status(403).json({ message: "Access denied" });
        }
      }

      const ratings = await models.store.getStoreRatings(pool, req.params.id);
      res.json(ratings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching ratings" });
    }
  });

  // Create store (admin only)
  router.post("/", authMiddleware, requireRole("admin"), async (req, res) => {
    const { name, email, address, owner_id } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Store name is required" });
    }

    try {
      const r = await models.store.insertStore(pool, {
        name,
        email,
        address,
        owner_id,
      });
      res.json(r);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error creating store" });
    }
  });

  router.get("/:id", optionalAuth, async (req, res) => {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    try {
      const storeQuery = `
        SELECT 
          s.id, s.name, s.address, 
          COALESCE(AVG(r.rating), 0) as "overallRating"
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        WHERE s.id = $1
        GROUP BY s.id
      `;
      const storeRes = await pool.query(storeQuery, [id]);

      if (storeRes.rows.length === 0) {
        return res.status(404).json({ message: "Store not found" });
      }

      const store = storeRes.rows[0];
      store.overallRating = parseFloat(store.overallRating);

      let userRating = null;
      if (userId) {
        const userRatingRes = await pool.query(
          "SELECT rating FROM ratings WHERE store_id = $1 AND user_id = $2",
          [id, userId]
        );
        if (userRatingRes.rows.length > 0) {
          userRating = userRatingRes.rows[0].rating;
        }
      }

      // Fetch rating distribution
      const distributionRes = await pool.query(
        `SELECT rating, COUNT(*) as count 
         FROM ratings 
         WHERE store_id = $1 
         GROUP BY rating`,
        [id]
      );
      const ratingDistribution = distributionRes.rows.reduce((acc, row) => {
        acc[row.rating] = parseInt(row.count, 10);
        return acc;
      }, {});

      res.json({ ...store, userRating, ratingDistribution });
    } catch (error) {
      console.error("Error fetching store details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};
