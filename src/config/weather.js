import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const weatherApiClient = axios.create({
  baseURL: process.env.WEATHER_BASE_URL,
  timeout: 5000, // Drop requests if the API takes longer than 5 seconds
  params: {
    key: process.env.WEATHER_API_KEY, // Automatically append ?key=... to all requests
  },
});

export default weatherApiClient;
