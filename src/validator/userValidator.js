import Joi from "joi";

// Reusable validation pieces to keep code DRY (Don't Repeat Yourself)
const emailSchema = Joi.string()
  .email({ minDomainSegments: 2 })
  .lowercase()
  .trim()
  .required()
  .messages({
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is a required field.",
  });
const ageSchema = Joi.number().integer().min(1).max(100).required().messages({
  "number.base": "Age must be a valid number",
  "number.integer": "Age must be a whole number",
  "number.min": "invalid age",
  "number.max": "invalid age",
  "any.required": "Age is a required field",
});
const passwordSchema = Joi.string()
  .min(8)
  .max(128) // Prevent DoS attacks with massive password strings
  .pattern(
    new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
    ),
  )
  .required()
  .messages({
    "string.min": "Password must be at least 8 characters long.",
    "string.max": "Password cannot exceed 128 characters.",
    "string.pattern.base":
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
  });

export const registerSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  age: ageSchema,
  // Sensitive info must be a clean string, limited in size to prevent memory bloat
  sensitiveInfo: Joi.string().max(5000).trim().allow("", null).optional(),
  role: Joi.string().valid("user", "admin", "moderator").default("user"),
});

export const loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required(), // Don't enforce complex patterns on login, just check if it exists
});

export const updateSchema = Joi.object({
  // Hexadecimal string validation ensures nobody injects malicious MongoDB IDs
  userId: Joi.string().hex().length(24).required(),
  email: emailSchema.optional(), // Optional during update
  age: ageSchema.optional(),
  sensitiveInfo: Joi.string().max(5000).trim().allow("", null).optional(),
}).min(2); // Requires at least userId + one field to update
