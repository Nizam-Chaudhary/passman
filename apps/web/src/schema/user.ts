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

// Update master password
export const updateMasterPasswordFormSchema = createMasterPasswordFormSchema;

export type UpdateMasterPasswordForm = z.infer<
    typeof updateMasterPasswordFormSchema
>;

// Reset password
export const resetPasswordFormSchema = z.object({
    password: masterPasswordSchema,
    confirmPassword: z.string().min(1, "Please enter password"),
});

export type ResetPasswordForm = z.infer<typeof resetPasswordFormSchema>;

// Verify Recovery Key
export const verifyRecoveryKeyFormSchema = z.object({
    recoveryKey: z.string().min(1, "Please enter recovery key"),
});

export type VerifyRecoveryKeyForm = z.infer<typeof verifyRecoveryKeyFormSchema>;
