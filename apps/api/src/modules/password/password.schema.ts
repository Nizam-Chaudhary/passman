import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { passwords } from "../../db/schema/schema";
import { responseSchema, statusSchema } from "../../utils/basicSchema";

const encryptedPasswordSchema = z
    .object({
        iv: z
            .string()
            .min(1, "iv is required")
            .describe("Initialization vector for encryption"),
        encrypted: z
            .string()
            .min(1, "password is required")
            .describe("Encrypted password string"),
    })
    .describe("Schema for encrypted password data");

const baseSchema = createInsertSchema(passwords, {
    vaultId: (schema) =>
        schema
            .min(0, "Vault id is required")
            .describe("ID of the vault this password belongs to"),
    name: (schema) =>
        schema
            .min(1, "Name is required")
            .describe("Name of the application or website")
            .optional(),
    username: (schema) =>
        schema
            .min(1, "Username is required")
            .describe("Username for the account"),
    password: () =>
        encryptedPasswordSchema.describe("Password for the account"),
    url: (schema) =>
        schema
            .min(1, "Url is required")
            .describe("Unique url of the application or website"),
    faviconUrl: (schema) =>
        schema
            .url("invalid url")
            .optional()
            .nullable()
            .describe("URL of the service favicon"),
    note: (schema) =>
        schema
            .optional()
            .nullable()
            .describe("Additional notes about the account"),
}).describe("Base schema for password records");

export const addPasswordSchema = z
    .object({
        vaultId: baseSchema.shape.vaultId,
        name: baseSchema.shape.name,
        username: baseSchema.shape.username,
        password: encryptedPasswordSchema,
        url: baseSchema.shape.url,
        faviconUrl: baseSchema.shape.faviconUrl,
        note: baseSchema.shape.note,
    })
    .describe("Schema for adding a new password");

export type AddPasswordInput = z.infer<typeof addPasswordSchema>;

export const importPasswordsSchema = z
    .array(addPasswordSchema)
    .describe("Schema for importing multiple passwords");

export type ImportPasswordsInput = z.infer<typeof importPasswordsSchema>;

export const updatePasswordSchema = z
    .object({
        name: baseSchema.shape.name.describe("Name for the account"),
        username: baseSchema.shape.username.describe(
            "Username for the account"
        ),
        password: encryptedPasswordSchema.describe("Password for the account"),
        url: baseSchema.shape.url.describe("URL of the application or website"),
        faviconUrl: baseSchema.shape.faviconUrl.describe(
            "URL of the service favicon"
        ),
        note: baseSchema.shape.note.describe(
            "Additional notes about the account"
        ),
    })
    .describe("Schema for updating an existing password");

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

const selectPasswordsModel = createSelectSchema(passwords, {
    id: (schema) =>
        schema.describe("Unique identifier for the password record"),
    userId: (schema) => schema.describe("User id"),
    name: (schema) => schema.describe("Name of the application or website"),
    username: (schema) => schema.describe("Username for the account"),
    password: () =>
        encryptedPasswordSchema.describe("Password for the account"),
    url: (schema) => schema.describe("URL of the application or website"),
    faviconUrl: (schema) => schema.describe("URL of the service favicon"),
    note: (schema) => schema.describe("Additional notes about the account"),
    createdAt: (schema) =>
        schema.describe("Timestamp when the record was created"),
    updatedAt: (schema) =>
        schema.describe("Timestamp when the record was last updated"),
}).describe("Schema for selecting password records");

export type SelectPasswordsModel = z.infer<typeof selectPasswordsModel>;

export const getPasswordsResponseSchema = z
    .object({
        status: statusSchema,
        data: z.array(selectPasswordsModel),
    })
    .describe("Schema for get passwords response");

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

export type getPasswordsQueryOptions = z.infer<
    typeof getPasswordsQueryStringSchema
>;

export const getPasswordResponseSchema = z
    .object({
        status: statusSchema,
        data: selectPasswordsModel,
    })
    .describe("Schema for single password response");

export const addOrUpdateOrDeletePasswordResponseSchema = responseSchema
    .and(
        z.object({
            data: selectPasswordsModel,
        })
    )
    .describe("Schema for add/update/delete password response");

export const importPasswordResponseSchema = responseSchema
    .and(
        z.object({
            data: selectPasswordsModel,
        })
    )
    .describe("Schema for import password response");

export const deleteMultiplePasswrodsBodySchema = z.object({
    ids: z.array(z.number().min(1)).min(1),
});

export type DeleteMultiplePasswordsBody = z.infer<
    typeof deleteMultiplePasswrodsBodySchema
>;

export const movePasswordsVaultBodySchema = z.object({
    vaultId: z.number().min(1),
    ids: z.array(z.number().min(1)).min(1),
});

export type MovePasswordsVaultBody = z.infer<
    typeof movePasswordsVaultBodySchema
>;
