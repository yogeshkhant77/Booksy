const express = require("express")
const { body } = require("express-validator")
const { register, login, forgotPassword, verifyOTP, resetPassword } = require("../controllers/authController")

const router = express.Router()

// Register route
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  register,
)

// Login route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login,
)

// Forgot password route
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Please enter a valid email")],
  forgotPassword,
)

// Verify OTP route
router.post(
  "/verify-otp",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
  ],
  verifyOTP,
)

// Reset password route
router.post(
  "/reset-password",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
    body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  resetPassword,
)

module.exports = router
