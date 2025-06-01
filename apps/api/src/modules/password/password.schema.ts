import { z } from "zod/v4";
import { encryptedValueSchema } from "../../utils/basicSchema";

export const getPasswordsQueryStringSchema = z
    .object({
        vaultId: z.coerce
            .number()
            .min(0, "Please provide vaultId")
            .describe("ID of the vault to fetch passwords from"),
        search: z
            .string()
            .min(1, "provide atleast one character")
            .optional()
            .describe("Search string to filter passwords"),
    })
    .describe("Schema for password query parameters");

export type GetPasswordsQueryOptions = z.infer<
    typeof getPasswordsQueryStringSchema
>;

const encryptedPasswordSchema = encryptedValueSchema;

export const addPasswordSchema = z
    .object({
        vaultId: z
            .number()
            .int()
            .positive("Vault id is required")
            .describe("ID of the vault this password belongs to"),
        name: z
            .string()
            .min(1, "Name is required")
            .max(255, "Name must be 255 characters or less")
            .describe("Name of the application or website")
            .nullable()
            .optional(),
        username: z
            .string()
            .min(1, "Username is required")
            .max(255, "Username must be 255 characters or less")
            .describe("Username for the account"),
        password: encryptedPasswordSchema.describe(
            "Encrypted password for the account"
        ),
        url: z
            .string()
            .min(1, "URL is required")
            .max(255, "URL must be 255 characters or less")
            .describe("URL of the application or website"),
        faviconUrl: z
            .url("Invalid favicon URL")
            .max(255, "Favicon URL must be 255 characters or less")
            .nullable()
            .optional()
            .describe("Favicon URL of the website"),
        note: z
            .string()
            .max(500, "Note must be 500 characters or less")
            .nullable()
            .optional()
            .describe("Additional notes about the account"),
    })
    .describe("Schema for adding a new password");

export type AddPasswordBody = z.infer<typeof addPasswordSchema>;

export const importPasswordsSchema = z
    .array(addPasswordSchema)
    .min(1, "At least one password is required for import")
    .describe("Schema for importing multiple passwords");

export type ImportPasswordsBody = z.infer<typeof importPasswordsSchema>;

export const updatePasswordSchema = z
    .object({
        name: z
            .string()
            .min(1, "Name is required")
            .max(255, "Name must be 255 characters or less")
            .describe("Name of the application or website")
            .nullable()
            .optional(),
        username: z
            .string()
            .min(1, "Username is required")
            .max(255, "Username must be 255 characters or less")
            .describe("Username for the account"),
        password: encryptedPasswordSchema.describe(
            "Encrypted password for the account"
        ),
        url: z
            .string()
            .min(1, "URL is required")
            .max(255, "URL must be 255 characters or less")
            .describe("URL of the application or website"),
        faviconUrl: z
            .url("Invalid favicon URL")
            .max(255, "Favicon URL must be 255 characters or less")
            .nullable()
            .optional()
            .describe("Favicon URL of the website"),
        note: z
            .string()
            .max(500, "Note must be 500 characters or less")
            .nullable()
            .optional()
            .describe("Additional notes about the account"),
    })
    .describe("Schema for updating an existing password");

export type UpdatePasswordBody = z.infer<typeof updatePasswordSchema>;

export const deleteMultiplePasswordsBodySchema = z.object({
    ids: z
        .array(z.number().int().positive("ID must be a positive integer"))
        .min(1, "At least one ID is required"),
});

export type DeleteMultiplePasswordsBody = z.infer<
    typeof deleteMultiplePasswordsBodySchema
>;

export const movePasswordsVaultBodySchema = z.object({
    vaultId: z.number().int().positive("Vault ID must be a positive integer"),
    ids: z
        .array(z.number().int().positive("ID must be a positive integer"))
        .min(1, "At least one ID is required"),
});

export type MovePasswordsVaultBody = z.infer<
    typeof movePasswordsVaultBodySchema
>;
