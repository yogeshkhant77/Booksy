const User = require("../models/User")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const { sendOTPEmail } = require("../utils/emailService")

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// Register user
const register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Set admin role for khantyogesh021@gmail.com
    const role = email.toLowerCase() === "khantyogesh021@gmail.com" ? "admin" : "user"

    // Create new user
    const user = new User({ name, email, password, role })
    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Login user
const login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate token
    const token = generateToken(user._id)

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Forgot password - Send OTP
const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email } = req.body

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({
        message: "If an account with that email exists, we've sent an OTP to your email.",
      })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Set OTP and expiry (10 minutes)
    user.resetPasswordOTP = otp
    user.resetPasswordOTPExpiry = Date.now() + 10 * 60 * 1000 // 10 minutes
    await user.save()

    // Send OTP email
    const emailSent = await sendOTPEmail(user.email, otp)

    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP email. Please try again." })
    }

    res.json({
      message: "If an account with that email exists, we've sent an OTP to your email.",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, otp } = req.body

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(400).json({ message: "Invalid email or OTP" })
    }

    // Check if OTP exists and is valid
    if (!user.resetPasswordOTP || !user.resetPasswordOTPExpiry) {
      return res.status(400).json({ message: "OTP not found or expired. Please request a new one." })
    }

    // Check if OTP is expired
    if (Date.now() > user.resetPasswordOTPExpiry) {
      user.resetPasswordOTP = null
      user.resetPasswordOTPExpiry = null
      await user.save()
      return res.status(400).json({ message: "OTP has expired. Please request a new one." })
    }

    // Verify OTP
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    // OTP is valid
    res.json({
      message: "OTP verified successfully",
      verified: true,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Reset password
const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, otp, newPassword } = req.body

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(400).json({ message: "Invalid email or OTP" })
    }

    // Check if OTP exists and is valid
    if (!user.resetPasswordOTP || !user.resetPasswordOTPExpiry) {
      return res.status(400).json({ message: "OTP not found or expired. Please request a new one." })
    }

    // Check if OTP is expired
    if (Date.now() > user.resetPasswordOTPExpiry) {
      user.resetPasswordOTP = null
      user.resetPasswordOTPExpiry = null
      await user.save()
      return res.status(400).json({ message: "OTP has expired. Please request a new one." })
    }

    // Verify OTP
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    // Update password
    user.password = newPassword
    user.resetPasswordOTP = null
    user.resetPasswordOTPExpiry = null
    await user.save()

    res.json({
      message: "Password reset successfully",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { register, login, forgotPassword, verifyOTP, resetPassword }
