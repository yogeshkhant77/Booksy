const mongoose = require("mongoose")
const dotenv = require("dotenv")
const User = require("../models/User")

// Load environment variables
dotenv.config()

const updateAdminRole = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    // Find user by email
    const email = "khantyogesh021@gmail.com"
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      console.log(`User with email ${email} not found`)
      process.exit(1)
    }

    // Update role to admin
    user.role = "admin"
    await user.save()

    console.log(`✅ Successfully updated ${email} to admin role`)
    console.log(`User: ${user.name}`)
    console.log(`Email: ${user.email}`)
    console.log(`Role: ${user.role}`)

    process.exit(0)
  } catch (error) {
    console.error("Error updating admin role:", error)
    process.exit(1)
  }
}

updateAdminRole()

