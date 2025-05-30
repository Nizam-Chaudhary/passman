import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "../../db/schema/users";
import { masterKeySchema, responseSchema } from "../../utils/basicSchema";

export const ecryptedValueSchema = z.object({
    iv: z
        .string()
        .min(1, "iv is required")
        .describe("Initialization vector for encryption"),
    encrypted: z.string().min(1, "key is required").describe("Encrypted data"),
});

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine((value) => /[A-Z]/.test(value), {
        message: "Password must contain at least one uppercase letter",
    })
    .refine((value) => /[a-z]/.test(value), {
        message: "Password must contain at least one lowercase letter",
    })
    .refine((value) => /\d/.test(value), {
        message: "Password must contain at least one number",
    })
    .refine((value) => /[$@!%*?&_]/.test(value), {
        message: "Password must contain at least one special character",
    })
    .describe("Password for the account");

const baseSchema = createInsertSchema(users, {
    userName: (schema) =>
        schema
            .min(2, "User name must be at least 4 characters")
            .describe("Username for the account"),
    email: (schema) =>
        schema
            .email("Invalid email format")
            .describe("Email address for the account"),
    password: passwordSchema,
    masterKey: () => ecryptedValueSchema,
    recoveryKey: () => ecryptedValueSchema,
});

// Signup
export const signUpUserSchema = z
    .object({
        userName: baseSchema.shape.userName,
        email: baseSchema.shape.email,
        password: baseSchema.shape.password,
    })
    .describe("Schema for user signup data");

export type SignUpUserInput = z.infer<typeof signUpUserSchema>;

// SignIn
export const signInUserSchema = z
    .object({
        email: baseSchema.shape.email,
        password: z
            .string()
            .min(8, "At least 8 characters")
            .describe("User account password"),
    })
    .describe("Schema for user signin data");

export type SignInUserInput = z.infer<typeof signInUserSchema>;

const selectUserModel = createSelectSchema(users, {
    masterKey: () => masterKeySchema,
})
    .pick({
        id: true,
        userName: true,
        email: true,
        masterKey: true,
        createdAt: true,
        updatedAt: true,
    })
    .describe("User model with selected fields for responses");

export const signUpUserResponseSchema = responseSchema
    .and(z.object({ data: selectUserModel }))
    .describe("Response schema for successful signup");

export const signInResponseSchema = responseSchema
    .and(
        z.object({
            data: z.object({
                token: z
                    .string()
                    .min(1, "token is required")
                    .describe("JWT access token"),
                refreshToken: z
                    .string()
                    .min(1, "refreshToken is required")
                    .describe("JWT refresh token"),
                id: z.number().min(1, "id is required").describe("User ID"),
                email: z.string().email().describe("User email address"),
                userName: z
                    .string()
                    .min(1, "userName is required")
                    .describe("Username"),
                masterKey: masterKeySchema
                    .nullable()
                    .describe("Encrypted master key"),
                isVerified: z.boolean().describe("Email verification status"),
            }),
        })
    )
    .describe("Response schema for successful signin");

export const refreshTokenBodySchema = z
    .object({
        refreshToken: z.string().describe("JWT refresh token"),
    })
    .describe("Schema for refresh token request");

export type RefreshTokenBody = z.infer<typeof refreshTokenBodySchema>;

export const refreshTokenResponseSchema = responseSchema
    .and(
        z.object({
            data: z.object({
                token: z
                    .string()
                    .min(1, "token is required")
                    .describe("New JWT access token"),
                refreshToken: z
                    .string()
                    .min(1, "refreshToken is required")
                    .describe("New JWT refresh token"),
            }),
        })
    )
    .describe("Response schema for token refresh");

export const verifyUserEmailBodySchema = z
    .object({
        email: z
            .string()
            .email("Invalid email format")
            .min(1, "Email is required")
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
        message: "Master password must contain at least one uppercase letter",
    })
    .refine((value) => /[a-z]/.test(value), {
        message: "Master password must contain at least one lowercase letter",
    })
    .refine((value) => /\d/.test(value), {
        message: "Master password must contain at least one number",
    })
    .refine((value) => /[$@!%*?&_]/.test(value), {
        message: "Master password must contain at least one special character",
    })
    .describe("Master password for the account");

export const createMasterKeyBodySchema = z
    .object({
        masterPassword: masterPasswordSchema,
        masterKey: masterKeySchema.describe("Encrypted master key"),
        recoveryKey: masterKeySchema.describe("Encrypted recovery key"),
    })
    .describe("Schema for creating master key");

export type CreateMasterKeyBody = z.infer<typeof createMasterKeyBodySchema>;

export interface JwtUserData {
    id: number;
    userName: string;
    email: string;
    masterKeyCreated: boolean;
    exp: number;
    iat: number;
}

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

export const verifyMasterPasswordResponseSchema = z
    .object({
        status: z.literal("success"),
        data: z.object({
            masterKey: masterKeySchema.describe("Encrypted master key"),
        }),
    })
    .describe("Response schema for master password verification");

export const resendOtpBodySchema = z
    .object({
        email: z
            .string()
            .email("Please provide valid email")
            .describe("Email to send OTP to"),
    })
    .describe("Schema for OTP resend request");

export const sendResetPasswordEmailBodySchema = resendOtpBodySchema;

export interface ResetPasswordJwtTokenPayload {
    email: string;
    exp: number;
    iat: number;
}

export const resetPasswordBodySchema = z
    .object({
        token: z.string().jwt().describe("JWT reset token"),
        password: passwordSchema,
    })
    .describe("Schema for password reset");

export type ResetPasswordBody = z.infer<typeof resetPasswordBodySchema>;

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
