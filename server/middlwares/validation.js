const validation = (req, res, next) => {
  const { email, username, password } = req.body;

  const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const isMissingCredentials = () => ![email, password].every(Boolean);

  // Check for missing or invalid credentials during registration
  if (req.path === "/register") {
    if (isMissingCredentials() || !validEmailRegex.test(email) || !username) {
      return res.json("Invalid or Missing Credentials");
    }
  }

  // Check for missing or invalid credentials during login
  if (
    req.path === "/login" &&
    (isMissingCredentials() || !validEmailRegex.test(email))
  ) {
    return res.json("Invalid or Missing Credentials");
  }

  next();
};

module.exports = validation;
