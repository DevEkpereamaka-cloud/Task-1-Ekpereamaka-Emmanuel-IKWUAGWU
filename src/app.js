import express from "express";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Middleware to parse JSON (Project 1 requirement)
app.use(express.json());

// Base Route
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

// API Routes
app.use("/api/users", userRoutes);

export default app;
