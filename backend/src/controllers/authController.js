import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("An account with that email already exists.");
  }

  const isFirstUser = (await User.countDocuments()) === 0;

  const user = await User.create({
    name,
    email,
    password,
    role: isFirstUser ? "admin" : "staff",
  });

  res.status(201).json({
    message: "Account created successfully.",
    token: generateToken(user._id),
    user: sanitizeUser(user),
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required.");
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  res.json({
    message: "Login successful.",
    token: generateToken(user._id),
    user: sanitizeUser(user),
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({
    user: sanitizeUser(req.user),
  });
});

