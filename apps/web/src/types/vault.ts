import { z } from "zod/v4";

export interface Vault {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
}

export interface GetVaultsResponseSchema {
    status: "success" | "fail" | "error";
    data: Vault[];
}

export const addVaultSchema = z.object({
    name: z.string().min(1, "Please provide vault name"),
});
