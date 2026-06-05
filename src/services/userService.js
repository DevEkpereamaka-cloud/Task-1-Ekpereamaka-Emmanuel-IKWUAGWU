import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { encryptData, decryptData } from "../utils/encryption.js";

/**
 * Helper function to create operational errors with status codes
 */
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true; // Flag for error-handling middleware
  return error;
};

export const registerUser = async (userData) => {
  try {
    const { email, password, sensitiveInfo } = userData;

    // Check for duplicate user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError("User already exists", 409); // 409 Conflict
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Encrypt sensitive info if provided
    let encryptedInfo = null;
    if (sensitiveInfo) {
      encryptedInfo = encryptData(sensitiveInfo);
    }

    const user = await User.create({
      email,
      password: hashedPassword,
      sensitiveInfo: encryptedInfo,
    });

    return { id: user._id, email: user.email };
  } catch (error) {
    // If it's already an operational error we threw, rethrow it
    if (error.isOperational) throw error;

    // Catch MongoDB validation or system errors
    throw createError(`Registration failed: ${error.message}`, 500);
  }
};

export const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    // Generic message for security (don't reveal if email exists)
    if (!user) {
      throw createError("Invalid credentials", 401); // 401 Unauthorized
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw createError("Invalid credentials", 401);
    }

    // Generate JWT
    if (!process.env.JWT_SECRET) {
      throw createError(
        "JWT secret is not defined in environment variables",
        500,
      );
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return { token, user: { id: user._id, email: user.email } };
  } catch (error) {
    if (error.isOperational) throw error;
    throw createError(`Login failed: ${error.message}`, 500);
  }
};

export const getDecryptedUserInfo = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw createError("User not found", 404); // 404 Not Found
    }

    if (!user.sensitiveInfo) {
      return { email: user.email, message: "No sensitive data stored" };
    }

    const decryptedData = decryptData(user.sensitiveInfo);
    return { email: user.email, decryptedSensitiveInfo: decryptedData };
  } catch (error) {
    if (error.isOperational) throw error;
    throw createError(`Failed to retrieve user info: ${error.message}`, 500);
  }
};

export const updateUserInfo = async (userId, updateData) => {
  try {
    // If updating sensitive info, re-encrypt it
    if (updateData.sensitiveInfo) {
      updateData.sensitiveInfo = encryptData(updateData.sensitiveInfo);
    }

    // Prevent password update via this route for security
    delete updateData.password;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true, // Ensures schema validation runs on updates
    }).select("-password");

    if (!user) {
      throw createError("User not found", 404);
    }

    return user;
  } catch (error) {
    if (error.isOperational) throw error;
    throw createError(`Failed to update user: ${error.message}`, 500);
  }
};

export const deleteUser = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw createError("User not found", 404);
    }

    return { message: "User deleted successfully" };
  } catch (error) {
    if (error.isOperational) throw error;
    throw createError(`Failed to delete user: ${error.message}`, 500);
  }
};
