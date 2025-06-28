import { randomBytes } from "node:crypto";

/**
 * Generates a random numeric one-time password (OTP) of specified length.
 *
 * @param {number} [length] - The length of the OTP to generate. Defaults to 6 digits.
 * @returns {string} - The generated OTP as a string.
 */
export function generateOtp(length: number = 6): string {
  let otp = "";
  const digits = "0123456789";

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return otp;
}

export function generateSalt(length = 16): string {
  return randomBytes(length).toString("hex");
}
