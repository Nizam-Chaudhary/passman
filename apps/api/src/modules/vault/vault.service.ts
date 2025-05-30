import { and, eq } from "drizzle-orm";

import { db } from "../../db/index";
import * as schema from "../../db/schema/schema";
import AppError from "../../lib/appError";

class UserService {
    async getVaults(userId: number) {
        const vaults = await db.query.vaults.findMany({
            where: eq(schema.vaults.userId, userId),
        });

        return {
            status: "success",
            data: vaults,
        };
    }

    async addVault(name: string, userId: number) {
        const vault = await db.query.vaults.findFirst({
            where: and(
                eq(schema.vaults.name, name),
                eq(schema.vaults.userId, userId)
            ),
        });

        if (vault) {
            throw new AppError(
                "VAULT_ALREADY_EXISTS",
                `Vault with name "${name}" already exists`,
                400
            );
        }
        const vaults = await db
            .insert(schema.vaults)
            .values({
                name,
                userId,
            })
            .returning();

        return {
            status: "success",
            message: "Vault created successfully",
            data: vaults[0],
        };
    }

    async updateVault(id: number, name: string, userId: number) {
        const vaults = await db
            .update(schema.vaults)
            .set({ name })
            .where(
                and(eq(schema.vaults.id, id), eq(schema.vaults.userId, userId))
            )
            .returning();

        if (vaults.length <= 0) {
            throw new AppError("VAULT_NOT_FOUND", "Vault not found", 400);
        }

        return {
            status: "success",
            message: "Vault updated successfully",
            data: vaults[0],
        };
    }

    async deleteVault(id: number, userId: number) {
        const vaults = await db
            .delete(schema.vaults)
            .where(
                and(eq(schema.vaults.id, id), eq(schema.vaults.userId, userId))
            )
            .returning();

        if (vaults.length <= 0) {
            throw new AppError("VAULT_NOT_FOUND", "Vault not found", 400);
        }

        return {
            status: "success",
            message: "Vault deleted successfully",
            data: vaults[0],
        };
    }
    // async getVaultsWithPasswords(userId: number, vaultId?: number) {
    //     const vaults = await db.query.vaults.findMany({
    //         where: (vaults, { and, eq }) =>
    //             and(
    //                 eq(vaults.userId, userId),
    //                 vaultId ? eq(vaults.id, vaultId) : undefined
    //             ),
    //         with: {
    //             passwords: {
    //                 orderBy: (passwords, { desc }) => [
    //                     desc(passwords.createdAt),
    //                 ],
    //             },
    //         },
    //     });

    //     return {
    //         status: "success",
    //         data: vaults,
    //     };
    // }

    // async getVaultsWithNotes(userId: number, vaultId?: number) {
    //     const vaults = await db.query.vaults.findMany({
    //         where: (vaults, { and, eq }) =>
    //             and(
    //                 eq(vaults.userId, userId),
    //                 vaultId ? eq(vaults.id, vaultId) : undefined
    //             ),
    //         with: {
    //             notes: {
    //                 orderBy: (notes, { desc }) => [desc(notes.updatedAt)],
    //             },
    //         },
    //     });

    //     return {
    //         status: "success",
    //         data: vaults,
    //     };
    // }
}

export default new UserService();
