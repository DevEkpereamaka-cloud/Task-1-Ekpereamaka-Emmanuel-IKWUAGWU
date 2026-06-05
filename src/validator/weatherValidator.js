import Joi from "joi";

export const weatherQuerySchema = Joi.object({
  q: Joi.string().required().messages({
    "string.empty": "Location query (q) is required to fetch weather.",
    "any.required": "Location query (q) is required to fetch weather.",
  }),
});
