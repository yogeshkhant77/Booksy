const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require("./routes/auth")
const bookRoutes = require("./routes/books")
const googleBooksRoutes = require("./routes/googleBooks")
const userRoutes = require("./routes/users")
const userBookRoutes = require("./routes/userBooks")
const adminRoutes = require("./routes/admin")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)
app.use("/api/google-books", googleBooksRoutes)
app.use("/api/users", userRoutes)
app.use("/api/my-books", userBookRoutes)
app.use("/api/admin", adminRoutes)

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Booksy API is running!" })
})

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    // Start server
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
  })

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})
