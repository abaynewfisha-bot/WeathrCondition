const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { jwtSecret } = require("../config/env");

function createToken(user) {
  if (jwtSecret.length < 32) {
    const error = new Error(
      "Configure JWT_SECRET with at least 32 characters."
    );

    error.status = 500;
    throw error;
  }

  return jwt.sign(
    { id: user.id, email: user.email },
    jwtSecret,
    { expiresIn: "7d" }
  );
}

exports.register = async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (
      !name ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      password.length < 8
    ) {
      return res.status(400).json({
        error: "Enter a name, valid email, and password with at least 8 characters."
      });
    }

    if (await User.findByEmail(email)) {
      return res.status(409).json({
        error: "Email already registered."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      passwordHash
    });

    res.status(201).json({
      user,
      token: createToken(user)
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "Email already registered."
      });
    }

    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    const user = await User.findByEmail(email);

    if (
      !user ||
      !(await bcrypt.compare(password, user.password_hash))
    ) {
      return res.status(401).json({
        error: "Invalid email or password."
      });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token: createToken(user)
    });
  } catch (error) {
    next(error);
  }
};
