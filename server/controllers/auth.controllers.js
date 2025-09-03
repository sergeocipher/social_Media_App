import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const signUp = async (req, res) => {
  const { name, userName, email, password } = req.body;
  try {
    // Validate User Data
    if (!name || !userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Validate Email
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }
    // Validate for userName
    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({ message: "Username already in use" });
    }
    // password length
    if (password.length <= 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create User
    const newUser = await User.create({ name, userName, email, password: hashedPassword });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Sign in
export const signIn = async (req, res) => {
  const { userName, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    // Allow user to log in
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
