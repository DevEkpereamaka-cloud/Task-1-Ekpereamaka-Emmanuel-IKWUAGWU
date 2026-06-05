import { getCurrentWeather } from "../services/weatherService.js";

export const getWeather = async (req, res, next) => {
  try {
    // req.query is already guaranteed to be valid and sanitized here!
    const weatherData = await getCurrentWeather(req.body.q);

    return res.status(200).json({
      status: "ok",
      data: weatherData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "please try again later" });
    next(error);
  }
};
