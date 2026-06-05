export const validateBody = (schema) => {
  return (req, res, next) => {
    // abortEarly: false forces Joi to find ALL errors, not just stop at the first one
    // stripUnknown: true automatically removes extra fields hackers try to inject
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      // Format Joi errors cleanly for the frontend
      const errorMessages = error.details.map((detail) => ({
        field: detail.context.key,
        message: detail.message.replace(/['"]/g, ""), // Removes ugly escaping quotes
      }));

      return res.status(400).json({
        status: "error",
        type: "ValidationError",
        errors: errorMessages,
      });
    }

    // Replace req.body with the cleaned, stripped value
    req.body = value;
    next();
  };
};
