import express from "express";
import { getWeather } from "../controllers/weatherController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validate.js";
import { weatherQuerySchema } from "../validator/weatherValidator.js";
const router = express.Router();
router.get("/", validateBody(weatherQuerySchema), getWeather);
export default router;
