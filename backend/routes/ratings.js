const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");

module.exports = (pool, models) => {
  router.post("/", authMiddleware, async (req, res) => {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    if (!storeId || !rating) {
      return res
        .status(400)
        .json({ message: "Store ID and rating are required." });
    }

    try {
      const newRating = await models.rating.upsertRating(pool, {
        userId,
        storeId,
        rating,
      });
      res.status(201).json(newRating);
    } catch (error) {
      console.error("Error submitting rating:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};
