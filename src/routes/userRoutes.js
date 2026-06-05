import express from "express";
import {
  register,
  login,
  getSensitiveInfo,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validate.js";
import {
  registerSchema,
  loginSchema,
  updateSchema,
} from "../validator/userValidator.js";

const router = express.Router();

// Public Routes (Project 1 & 3)
router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);

// Protected Routes (Project 2 & 3 - CRUD & Auth)
// Requires Bearer Token
router.get("/sensitive-info", protectRoute, getSensitiveInfo); // Read / Decrypt
router.patch("/update", protectRoute, validateBody(updateSchema), updateUser); // Update
router.delete("/delete", protectRoute, deleteUser); // Delete

export default router;
