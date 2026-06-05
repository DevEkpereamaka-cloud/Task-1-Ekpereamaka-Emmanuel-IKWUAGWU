import weatherApiClient from "../config/weather.js";
import dotenv from "dotenv";
dotenv.config();
export const getCurrentWeather = async (location) => {
  try {
    // We only need to pass 'q' because 'key' is handled by the Axios instance
    const response = await weatherApiClient.get("/current.json", {
      params: { q: location },
    });

    return response.data;
  } catch (error) {
    // Log the error internally for debugging
    console.error(
      `[WeatherService] Error fetching weather for ${location}:`,
      error.message,
    );

    // Extract the specific error message from WeatherAPI if it exists, otherwise use a generic one
    const errorMessage =
      error.response?.data?.error?.message ||
      "Failed to fetch weather data from external API";

    // Throw it up to the controller
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
};
