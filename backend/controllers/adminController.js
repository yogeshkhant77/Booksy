const User = require("../models/User")

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -resetPasswordOTP -resetPasswordOTPExpiry").sort({ createdAt: -1 })

    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get user by ID (admin only)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -resetPasswordOTP -resetPasswordOTPExpiry")
      .populate("likedBooks")
      .populate("cart.book")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get user statistics (admin only)
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalAdmins = await User.countDocuments({ role: "admin" })
    const totalRegularUsers = await User.countDocuments({ role: "user" })

    res.json({
      totalUsers,
      totalAdmins,
      totalRegularUsers,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserStats,
}

