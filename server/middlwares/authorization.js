require("dotenv").config();
const jwt = require("jsonwebtoken");

const authorization = async (req, res, next) => {
  const token = req.cookies.access_token;

  // Check if not token
  if (!token) {
    return res.status(403).json({ msg: "Authorization denied" });
  }

  // Verify token
  try {
    const verify = jwt.verify(token, process.env.JWT);

    req.user = verify.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authorization;
