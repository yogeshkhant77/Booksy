const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("../routes/auth");
const bookRoutes = require("../routes/books");
const googleBooksRoutes = require("../routes/googleBooks");
const userRoutes = require("../routes/users");
const userBookRoutes = require("../routes/userBooks");
const adminRoutes = require("../routes/admin");

const app = express();

// Middleware
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];

// Add all Vercel app domains
const vercelDomainRegex = /https:\/\/.*\.vercel\.app$/;

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || vercelDomainRegex.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/google-books", googleBooksRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-books", userBookRoutes);
app.use("/api/admin", adminRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Booksy API is running!" });
});

// MongoDB connection
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;
