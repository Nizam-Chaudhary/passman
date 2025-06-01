import { z } from "zod/v4";
import { masterKeySchema } from "../../utils/basicSchema";

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine((value) => /[A-Z]/.test(value), {
        error: "Password must contain at least one uppercase letter",
    })
    .refine((value) => /[a-z]/.test(value), {
        error: "Password must contain at least one lowercase letter",
    })
    .refine((value) => /\d/.test(value), {
        error: "Password must contain at least one number",
    })
    .refine((value) => /[$@!%*?&_]/.test(value), {
        error: "Password must contain at least one special character",
    })
    .describe("Password for the account");

// Signup
export const signUpUserBodySchema = z
    .object({
        userName: z
            .string()
            .min(2, "Username is required")
            .max(255, "Username must be 255 characters or less")
            .describe("User account username"),
        email: z
            .email({ error: "Invalid email format" })
            .max(255, "Email must be 255 characters or less")
            .describe("User account email"),
        password: passwordSchema,
    })
    .describe("Schema for user signup data");

export type SignUpUserBody = z.infer<typeof signUpUserBodySchema>;

// Update user details
export const updateUserDetailsBodySchema = z
    .object({
        userName: z
            .string()
            .min(2, "Username is required")
            .max(255, "Username must be 255 characters or less")
            .describe("User account username"),
        fileId: z.number().positive().describe("File ID"),
    })
    .describe("Schema for user details update data");

export type UpdateUserDetailsBody = z.infer<typeof updateUserDetailsBodySchema>;

// Verify email
export const verifyUserEmailBodySchema = z
    .object({
        email: z
            .email({ error: "Invalid email format" })
            .min(1, "Email is required")
            .max(255, "Email must be 255 characters or less")
            .describe("User email to verify"),
        otp: z
            .string()
            .length(6, "OTP must be 6 characters long")
            .describe("One-time password for verification"),
    })
    .describe("Schema for email verification");

export type VerifyUserEmailBody = z.infer<typeof verifyUserEmailBodySchema>;

const masterPasswordSchema = z
    .string()
    .min(10, "Master password must be at least 10 characters")
    .refine((value) => /[A-Z]/.test(value), {
        error: "Master password must contain at least one uppercase letter",
    })
    .refine((value) => /[a-z]/.test(value), {
        error: "Master password must contain at least one lowercase letter",
    })
    .refine((value) => /\d/.test(value), {
        error: "Master password must contain at least one number",
    })
    .refine((value) => /[$@!%*?&_]/.test(value), {
        error: "Master password must contain at least one special character",
    })
    .describe("Master password for the account");

// Create master key
export const createMasterKeyBodySchema = z
    .object({
        masterPassword: masterPasswordSchema,
        masterKey: masterKeySchema.describe("Encrypted master key"),
        recoveryKey: masterKeySchema.describe("Encrypted recovery key"),
    })
    .describe("Schema for creating master key");

export type CreateMasterKeyBody = z.infer<typeof createMasterKeyBodySchema>;

// Verify master password
export const verifyMasterPasswordBodySchema = z
    .object({
        masterPassword: z
            .string()
            .min(1, "Master password is required")
            .describe("Master password to verify"),
    })
    .describe("Schema for master password verification");

export type VerifyMasterPasswordBody = z.infer<
    typeof verifyMasterPasswordBodySchema
>;

// Resend otp
export const resendOtpBodySchema = z
    .object({
        email: z
            .email({ error: "Invalid email format" })
            .min(1, "Email is required")
            .max(255, "Email must be 255 characters or less")
            .describe("User email to verify"),
    })
    .describe("Schema for OTP resend request");

export const sendResetPasswordEmailBodySchema = resendOtpBodySchema;
export type ResendOtpBody = z.infer<typeof resendOtpBodySchema>;
export type sendResetPasswordEmailBody = ResendOtpBody;

// Reset password
export interface ResetPasswordJwtTokenPayload {
    email: string;
    exp: number;
}

export const resetPasswordBodySchema = z
    .object({
        token: z.jwt({ error: "Invalid token" }).describe("JWT reset token"),
        password: passwordSchema,
    })
    .describe("Schema for password reset");

export type ResetPasswordBody = z.infer<typeof resetPasswordBodySchema>;

// Update master password
export const updateMasterPasswordBodySchema = z
    .object({
        masterPassword: masterPasswordSchema,
        masterKey: masterKeySchema.describe("New encrypted master key"),
        recoveryKey: masterKeySchema.describe("New encrypted recovery key"),
    })
    .describe("Schema for updating master password");

export type UpdateMasterPasswordBody = z.infer<
    typeof updateMasterPasswordBodySchema
>;
