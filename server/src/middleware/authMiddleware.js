const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");

module.exports = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      error: "Authentication required."
    });
  }

  if (jwtSecret.length < 32) {
    return res.status(500).json({
      error: "Server authentication is not configured."
    });
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch {
    return res.status(401).json({
      error: "Invalid or expired token."
    });
  }
};
