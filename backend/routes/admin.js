const express = require("express")
const { getAllUsers, getUserById, getUserStats } = require("../controllers/adminController")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")

const router = express.Router()

// All routes require admin role
router.use(auth)
router.use(admin)

// Get all users
router.get("/users", getAllUsers)

// Get user statistics
router.get("/users/stats", getUserStats)

// Get user by ID
router.get("/users/:id", getUserById)

module.exports = router

