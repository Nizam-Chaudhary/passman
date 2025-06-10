import {
    masterPasswordSchema,
    verifyUserEmailBodySchema,
} from "@passman/schema/api";
import { z } from "zod/v4";

// Verify user email
export const verifyUserEmailFormSchema = verifyUserEmailBodySchema.pick({
    otp: true,
});

export type VerifyUserEmailForm = z.infer<typeof verifyUserEmailFormSchema>;

// Create master password
export const createMasterPasswordFormSchema = z
    .object({
        masterPassword: masterPasswordSchema,
        confirmMasterPassword: z.string().min(1, "Please enter password"),
    })
    .refine((data) => data.confirmMasterPassword === data.masterPassword, {
        error: "Password not matching",
        path: ["confirmMasterPassword"],
    });

export type CreateMasterPasswordForm = z.infer<
    typeof createMasterPasswordFormSchema
>;

// Reset password
export const resetPasswordFormSchema = z.object({
    password: masterPasswordSchema,
    confirmPassword: z.string().min(1, "Please enter password"),
});

export type ResetPasswordForm = z.infer<typeof resetPasswordFormSchema>;
