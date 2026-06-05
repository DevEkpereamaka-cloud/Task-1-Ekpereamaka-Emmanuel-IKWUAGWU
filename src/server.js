import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Initialize Server and Database
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running in mode on port ${PORT}`);
  });
};

startServer();
