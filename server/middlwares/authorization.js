require("dotenv").config();
const jwt = require("jsonwebtoken");

// Authorization middleware
const authorization = async (req, res, next) => {
  const token = req.cookies.access_token;

  // Check if token is missing
  if (!token) {
    return res.status(403).json({ msg: "Authorization denied" });
  }

  try {
    const verify = jwt.verify(token, process.env.JWT);

    // Check if token has expired
    if (Date.now() > verify.exp * 1000) {
      return res.status(401).json({ msg: "Token has expired" });
    }

    req.user = verify.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authorization;
