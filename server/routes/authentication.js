const router = require("express").Router();
const pool = require("../models/database");
const bcrypt = require("bcrypt");
const generator = require("../utils/generator");
const authorization = require("../middlwares/authorization");
const validation = require("../middlwares/validation");

// User registration
router.post("/register", validation, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE user_email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json("You already have an account");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    const token = generator(newUser.rows[0].user_id);

    return res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ message: "Registered successfully" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server error");
  }
});

// User login
router.post("/login", validation, async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE user_email = $1",
      [email]
    );

    if (existingUser.rows.length === 0) {
      return res.json("You don't have an account");
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.rows[0].user_password
    );

    if (!isValidPassword) {
      return res.json("Username or password is incorrect");
    }

    const token = generator(existingUser.rows[0].user_id);

    return res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ message: "Logged in successfully" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server error");
  }
});

// Verify user
router.post("/verify", authorization, (req, res) => {
  try {
    return res.json(true);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server error");
  }
});

module.exports = router;
