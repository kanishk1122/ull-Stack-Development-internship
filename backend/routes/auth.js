const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
} = require("../utils/validation");
const router = express.Router();

module.exports = (pool, models) => {
  router.post("/register", async (req, res) => {
    const { name, email, address, password } = req.body;

    // Validate inputs
    const nameError = validateName(name);
    if (nameError) return res.status(400).json({ message: nameError });

    const emailError = validateEmail(email);
    if (emailError) return res.status(400).json({ message: emailError });

    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ message: passwordError });

    const addressError = validateAddress(address);
    if (addressError) return res.status(400).json({ message: addressError });

    const hash = await bcrypt.hash(password, 10);
    try {
      const user = await models.user.createUser(pool, {
        name,
        email,
        passwordHash: hash,
        address,
      });
      res.json({ success: true, user });
    } catch (err) {
      console.error(err);
      if (err.code === "23505") {
        return res.status(400).json({ message: "Email already exists" });
      }
      res.status(400).json({ message: "Error creating user" });
    }
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await models.user.findByEmail(pool, email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "change_this",
      { expiresIn: "8h" }
    );
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      },
    });
  });

  router.post("/signup-owner", async (req, res) => {
    const { name, email, password, address, storeName, storeAddress } =
      req.body;

    if (!storeName || !storeAddress) {
      return res
        .status(400)
        .json({ message: "Store name and address are required." });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Check if user already exists
      const userExists = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      if (userExists.rows.length > 0) {
        throw new Error("User with this email already exists.");
      }

      // Create user with STORE_OWNER role
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, 10);
      const userResult = await client.query(
        "INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [name, email, hashedPassword, address, "STORE_OWNER"]
      );
      const newUserId = userResult.rows[0].id;

      // Create store and link to new user
      await client.query(
        "INSERT INTO stores (name, address, owner_id) VALUES ($1, $2, $3)",
        [storeName, storeAddress, newUserId]
      );

      await client.query("COMMIT");
      res
        .status(201)
        .json({ message: "Store owner and store created successfully." });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Owner signup error:", error);
      res
        .status(500)
        .json({
          message: error.message || "Server error during owner signup.",
        });
    } finally {
      client.release();
    }
  });

  return router;
};
