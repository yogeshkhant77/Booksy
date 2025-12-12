const mongoose = require("mongoose")

const userBookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Ensure user can't add the same book twice
userBookSchema.index({ user: 1, book: 1 }, { unique: true })

module.exports = mongoose.model("UserBook", userBookSchema)

