import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // Import your Mongoose model

export const protectRoute = async (req, res, next) => {
  let token;

  // 1. Extract token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "Not authorized, no token provided" });
  }

  try {
    // 2. Verify the token signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. SECURITY FIX: Fetch fresh user data from DB to ensure they still exist/are active
    // Exclude the password field for security
    const freshUser = await User.findById(decoded.id).select("-password");

    if (!freshUser) {
      return res.status(401).json({
        status: "error",
        message: "The user belonging to this token no longer exists.",
      });
    }

    if (!freshUser.isActive) {
      return res.status(401).json({
        status: "error",
        message: "This user account has been deactivated.",
      });
    }

    // 4. Attach the actual, up-to-date database user object to the request
    req.user = freshUser;

    next();
  } catch (error) {
    // Handle specific JWT errors cleanly
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Your token has expired. Please log in again.",
      });
    }
    return res.status(401).json({
      status: "error",
      message: "Not authorized, token validation failed",
    });
  }
};
