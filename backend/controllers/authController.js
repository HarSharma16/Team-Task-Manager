const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});

const signToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const requestedRole = req.body.role;
  const allowRoleSignup = process.env.ALLOW_ROLE_SIGNUP !== "false";
  const role = allowRoleSignup && ["admin", "member"].includes(requestedRole) ? requestedRole : "member";

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error("Email is already registered");
  }

  const user = await User.create({ name, email, password, role });
  const token = signToken(user);

  res.status(201).json({
    token,
    user: sanitizeUser(user)
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = signToken(user);

  res.json({
    token,
    user: sanitizeUser(user)
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("name email role").sort({ name: 1 });
  res.json(users.map(sanitizeUser));
});

module.exports = { signup, login, me, listUsers };
