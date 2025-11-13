const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { authMiddleware } = require("../middleware/auth");

module.exports = (pool) => {
  // PATCH /api/users/change-password
  router.patch("/change-password", authMiddleware, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new passwords are required" });
    }

    try {
      const { rows } = await pool.query(
        "SELECT password FROM users WHERE id = $1",
        [userId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid current password" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
        hashedPassword,
        userId,
      ]);

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};
