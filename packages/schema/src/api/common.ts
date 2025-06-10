import { z } from "zod/v4";

// :id params schema
export const idParamsSchema = z.object({
    id: z.coerce.number().min(1),
});

export type IdParamsType = z.infer<typeof idParamsSchema>;

// encrypted password schema
export const encryptedPasswordSchema = z.object({
    iv: z.string().min(1, "iv is required"),
    encrypted: z.string().min(1, "key is required"),
});

export type EncryptedPassword = z.infer<typeof encryptedPasswordSchema>;

// master key schema
export const masterKeySchema = z.object({
    iv: z.string().min(1, "iv is required"),
    encrypted: z.string().min(1, "key is required"),
    salt: z.string().min(1, "salt is required"),
});

// auth header schema
export const headerSchema = z.object({
    Authorization: z.string().min(1, "Authorization is required"),
});
