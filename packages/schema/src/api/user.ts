import { z } from "zod/v4";
import { masterKeySchema } from "./common";

export const passwordSchema = z
  .string()
  .min(8, "Must contain at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one capital letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/\d/, "Must contain at least one digit")
  .regex(/[^A-Z0-9]/i, "Must contain at least one special character");

// Signup
export const registerUserBodySchema = z.object({
  userName: z
    .string()
    .min(2, "must be more than 2 characters")
    .max(255, "must be 255 characters or less"),
  email: z.email({ error: "Please enter a valid email address" }),
  password: passwordSchema,
});

export type RegisterUserBody = z.infer<typeof registerUserBodySchema>;

// Update user details
export const updateUserDetailsBodySchema = z.object({
  userName: z
    .string()
    .min(2, "Username is required")
    .max(255, "Username must be 255 characters or less")
    .optional(),
  fileId: z.number().positive().optional(),
});

export type UpdateUserDetailsBody = z.infer<typeof updateUserDetailsBodySchema>;

// Verify email
export const verifyUserEmailBodySchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
  otp: z.string().length(6, "OTP must be 6 characters long"),
});

export type VerifyUserEmailBody = z.infer<typeof verifyUserEmailBodySchema>;

export const masterPasswordSchema = z
  .string()
  .min(10, "Master password must be at least 10 characters")
  .regex(/[A-Z]/, "Must contain at least one capital letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/\d/, "Must contain at least one digit")
  .regex(/[^A-Z0-9]/i, "Must contain at least one special character");

// Create master key
export const createMasterKeyBodySchema = z.object({
  masterPassword: masterPasswordSchema,
  masterKey: masterKeySchema,
  recoveryKey: masterKeySchema,
});

export type CreateMasterKeyBody = z.infer<typeof createMasterKeyBodySchema>;

// Verify master password
export const verifyMasterPasswordBodySchema = z.object({
  masterPassword: z.string().min(1, "Please enter master password"),
});

export type VerifyMasterPasswordBody = z.infer<typeof verifyMasterPasswordBodySchema>;

// Resend otp
export const resendOtpBodySchema = z.object({
  email: z.email({ error: "Please enter valid email address" }),
});

export const sendResetPasswordEmailBodySchema = resendOtpBodySchema;
export type ResendOtpBody = z.infer<typeof resendOtpBodySchema>;
export type SendResetPasswordEmailBody = ResendOtpBody;

// Reset password
export interface ResetPasswordJwtTokenPayload {
  email: string;
  exp: number;
}

export const resetPasswordBodySchema = z.object({
  token: z.jwt({ error: "Invalid token" }),
  password: passwordSchema,
});

export type ResetPasswordBody = z.infer<typeof resetPasswordBodySchema>;

// Update master password
export const updateMasterPasswordBodySchema = z.object({
  masterPassword: masterPasswordSchema,
  masterKey: masterKeySchema,
  recoveryKey: masterKeySchema,
});

export type UpdateMasterPasswordBody = z.infer<typeof updateMasterPasswordBodySchema>;
