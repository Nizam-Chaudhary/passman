import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { vaults } from "../../db/schema/schema";
import { statusSchema } from "../../utils/basicSchema";

export const selectVaultsSchema = createSelectSchema(vaults).describe(
    "Schema for selecting vault data"
);

export const getVaultsResponseSchema = z
    .object({
        status: statusSchema,
        data: z.array(selectVaultsSchema),
    })
    .describe("Response schema for getting all vaults");

export const addUpdateVaultBodySchema = z
    .object({
        name: z.string().min(1, "Vault name is required"),
    })
    .describe("Request body schema for adding or updating a vault");

export const addVaultResponseSchema = z
    .object({
        status: z.literal("success"),
        message: z.literal("Vault created successfully"),
        data: selectVaultsSchema,
    })
    .describe("Response schema for adding a new vault");

export const updateVaultResponseSchema = z
    .object({
        status: z.literal("success"),
        message: z.literal("Vault updated successfully"),
        data: selectVaultsSchema,
    })
    .describe("Response schema for updating an existing vault");

export const deleteVaultResponseSchema = z
    .object({
        status: z.literal("success"),
        message: z.literal("Vault deleted successfully"),
        data: selectVaultsSchema,
    })
    .describe("Response schema for deleting a vault");

export const getVaultWithResourceQuerySchema = z
    .object({
        vaultId: z.coerce.number().min(0, "vaultId cannot be empty").optional(),
    })
    .describe("Query parameters schema for getting vault with resources");

export type getVaultResourceQueryOptions = z.infer<
    typeof getVaultWithResourceQuerySchema
>;
