import type { ApiResponse } from "./common";
import { z } from "zod/v4";
import { ecryptedValueSchema } from "./common";
import { passwordSchema } from "@passman/schema/api/user";

export const createMasterPasswordFormSchema = z
    .object({
        masterPassword: z
            .string()
            .min(10, "Must contain at least 10 characters")
            .regex(/[A-Z]/, "Must contain at least one capital letter")
            .regex(/[a-z]/, "Must contain at least one lowercase letter")
            .regex(/\d/, "Must contain at least one digit")
            .regex(/[^A-Z0-9]/i, "Must contain at least one special character"),
        confirmMasterPassword: z.string(),
    })
    .refine((data) => data.masterPassword === data.confirmMasterPassword, {
        message: "Passwords must match",
        path: ["confirmMasterPassword"],
    });

export type CreateMasterPasswordFormData = z.infer<
    typeof createMasterPasswordFormSchema
>;

export const updateMasterPasswordFormSchema = createMasterPasswordFormSchema;
export type UpdateMasterPasswordFormData = CreateMasterPasswordFormData;

const masterKeySchema = ecryptedValueSchema.and(
    z.object({
        salt: z.string().min(1, "Satl must be at least 1 character"),
    })
);

export type MasterKey = z.infer<typeof masterKeySchema>;

export const createMasterKeyRequestBodySchema = z.object({
    masterPassword: z.string().min(1, "Master password is required"),
    masterKey: masterKeySchema,
    recoveryKey: masterKeySchema,
});

export type CreateMasterKeyPayload = z.infer<
    typeof createMasterKeyRequestBodySchema
>;

export const verifyMasterPasswordFormSchema = z.object({
    masterPassword: z.string().min(10, "Must contain at least 10 characters"),
});

export type VerifyMasterPasswordFormData = z.infer<
    typeof verifyMasterPasswordFormSchema
>;

export type VerifyMasterPasswordApiResponse = ApiResponse & {
    data: {
        masterKey: z.infer<typeof masterKeySchema>;
    };
};

export const sendResetPassswordEmailFormSchema = z.object({
    email: z.string().email("Enter valid email"),
});

export const resetPasswordFormSchema = z
    .object({
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords must match",
        path: ["confirmPassword"],
    });

export type ResetPasswordForm = z.infer<typeof resetPasswordFormSchema>;

export interface ResetPasswordPayload {
    token: string;
    password: string;
}

export interface UpdateMasterPasswordPayload {
    masterPassword: string;
    masterKey: MasterKey;
    recoveryKey: MasterKey;
}

export const verifyRecoverKeyFormSchema = z.object({
    recoveryKey: z.string().min(1, "Recover key is required"),
});

export type VerifyRecoverKeyFormData = z.infer<
    typeof verifyRecoverKeyFormSchema
>;

export const verifyRecoveryMasterPasswordFormSchema = z.object({
    masterPassword: z.string().min(1, "Master password is required"),
});

export type VerifyRecoveryMasterPasswordFormData = z.infer<
    typeof verifyRecoveryMasterPasswordFormSchema
>;

export interface UserDetails {
    id: number;
    userName: string;
    email: string;
    masterKey: {
        iv: string;
        encrypted: string;
        salt: string;
    };
    recoveryKey: {
        iv: string;
        encrypted: string;
        salt: string;
    };
    createdAt: string;
    updatedAt: string;
}
