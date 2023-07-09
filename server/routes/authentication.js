const router = require("express").Router();
const pool = require("../models/database");
const bcrypt = require("bcrypt");
const generator = require("../utils/generator");
const authorization = require("../middlwares/authorization");

//user registration
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const checkUser = await pool.query(
      "select * from users where user_email =$1",
      [email]
    );

    if (checkUser.rows.length > 0) {
      return res.json("You already have an account");
    }

    const saltRounds = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, bcryptPassword]
    );

    const token = generator(newUser.rows[0].user_id);

    res.header("token", `${token}`);

    res.json({ token });
  } catch (err) {
    console.error(err.message);
  }
});

//login

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkUser = await pool.query(
      "select * from users where user_email =$1",
      [email]
    );

    if (checkUser.rows.length === 0) {
      return res.json("You don't have an account");
    }

    const validPassword = await bcrypt.compare(
      password,
      checkUser.rows[0].user_password
    );

    if (!validPassword) {
      return res.json("Username or password is incorrect");
    }

    const token = generator(checkUser.rows[0].user_id);

    return res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ message: "Logged in successfully 😊 👌" });
  } catch (err) {
    console.error(err.message);
  }
});

router.post("/verify", authorization, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
