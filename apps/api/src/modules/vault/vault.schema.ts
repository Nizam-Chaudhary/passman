import { z } from "zod/v4";

export const addVaultBodySchema = z
    .object({
        name: z
            .string()
            .min(1, "Vault name is required")
            .max(255, "Vault name must be 255 characters or less"),
    })
    .describe("Request body schema for adding or updating a vault");

export const updateVaultBodySchema = addVaultBodySchema;
export type AddVaultBodySchema = z.infer<typeof addVaultBodySchema>;
export type UpdateVaultBodySchema = z.infer<typeof updateVaultBodySchema>;

export const getVaultWithResourceQuerySchema = z
    .object({
        vaultId: z.coerce.number().min(0, "vaultId cannot be empty").optional(),
    })
    .describe("Query parameters schema for getting vault with resources");

export type getVaultResourceQueryOptions = z.infer<
    typeof getVaultWithResourceQuerySchema
>;
