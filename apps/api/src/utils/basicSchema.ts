import { z } from "zod";

export const statusSchema = z
    .enum(["success", "fail", "error"])
    .describe("Response status indicating success, failure or error");

export const responseSchema = z
    .object({
        status: statusSchema,
        message: z.string(),
    })
    .describe("Generic response schema with status and message");

export const idParamsSchema = z
    .object({
        id: z.coerce.number().min(1),
    })
    .describe("Schema for ID parameters requiring positive numbers");

export const errorSchema = z
    .union([
        z.object({
            status: statusSchema.default("error"),
            message: z.string().default("something went wrong"),
            issues: z.any().optional().nullable().default(null),
        }),
        z.object({
            status: statusSchema.default("error"),
            message: z.string().default("something went wrong"),
            stack: z.string().optional().nullable(),
        }),
        z.object({
            status: statusSchema.default("error"),
            message: z.string().default("something went wrong"),
        }),
    ])
    .describe("Error response schema with optional issues or stack trace");

export type IdParamsType = z.infer<typeof idParamsSchema>;

export const encryptedValueSchema = z
    .object({
        iv: z.string().min(1, "iv is required"),
        encrypted: z.string().min(1, "key is required"),
    })
    .describe("Schema for encrypted values with initialization vector");

export type EncryptedValueType = z.infer<typeof encryptedValueSchema>;

export const masterKeySchema = z
    .object({
        iv: z.string().min(1, "iv is required"),
        encrypted: z.string().min(1, "key is required"),
        salt: z.string().min(1, "salt is required"),
    })
    .describe("Schema for master key with iv, encrypted key and salt");

export type MasterKeyType = z.infer<typeof masterKeySchema>;
