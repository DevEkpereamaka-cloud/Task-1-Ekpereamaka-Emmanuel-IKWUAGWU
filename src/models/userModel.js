import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/,
        "Please provide a valid email address",
      ],
      index: true, // Ensures an optimized index is created for lookups
    },
    age: {
      type: Number,
      min: 1,
      max: [100, "invalid age"],
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Prevents password from being returned in standard queries
    },
    sensitiveInfo: {
      type: String,
      required: false,
      select: false, // Only pull this into memory when explicitly needed
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    // Ensures virtuals/getters are included when converting to JSON or Objects
    toJSON: { getters: true },
    toObject: { getters: true },
  },
);
export default mongoose.model("User", userSchema);
