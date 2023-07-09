require("dotenv").config();
const jwt = require("jsonwebtoken");

const generator = (user_id) => {
  const data = {
    user: user_id,
  };

  return jwt.sign(data, process.env.JWT, { expiresIn: "1h" });
};

module.exports = generator;
