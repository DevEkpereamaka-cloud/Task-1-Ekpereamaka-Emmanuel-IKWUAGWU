import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

// Best practice: Store your key as a 64-character hex string in .env
// so you don't run into weird string encoding issues when making it a Buffer.
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 12 bytes (96 bits) is standard for GCM

export const encryptData = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // GCM generates an auth tag that must be stored alongside the data
  const authTag = cipher.getAuthTag().toString("hex");

  // Format: iv:encrypted_data:auth_tag
  return `${iv.toString("hex")}:${encrypted}:${authTag}`;
};

export const decryptData = (text) => {
  try {
    const parts = text.split(":");
    const iv = Buffer.from(parts[0], "hex");
    const encryptedText = parts[1];
    const authTag = Buffer.from(parts[2], "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

    // The auth tag must be set before decryption
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    // GCM will throw an error here if the data or auth tag was tampered with!
    console.error("Decryption failed. Data may have been tampered with.");
    return null;
  }
};
