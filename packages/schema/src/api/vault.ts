import { z } from "zod/v4";

// Add vault
export const addVaultBodySchema = z.object({
  name: z
    .string()
    .min(1, "Please enter vault name")
    .max(255, "Vault name must be 255 characters or less"),
});

// Update vault
export const updateVaultBodySchema = addVaultBodySchema;

// Types
export type AddVaultBodySchema = z.infer<typeof addVaultBodySchema>;
export type UpdateVaultBodySchema = z.infer<typeof updateVaultBodySchema>;

// Query parameters schema for getting vault with resources
export const getVaultWithResourceQuerySchema = z
  .object({
    vaultId: z.coerce.number().min(0, "vaultId cannot be empty").optional(),
  })
  .describe("Query parameters schema for getting vault with resources");

export type getVaultResourceQueryOptions = z.infer<typeof getVaultWithResourceQuerySchema>;

export interface Vault {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}
