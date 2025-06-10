import type {
    AddPasswordBody,
    ImportPasswordsBody,
    MoveMultiplePasswordsVaultBody,
    UpdatePasswordBody,
} from "@passman/schema/api";

import { and, desc, eq, like, inArray, or } from "drizzle-orm";

import { db } from "../../db/index";
import { passwords } from "../../db/schema";
import { NotFoundException } from "../../lib/responseExceptions";

class PasswordService {
    async addPassword(userId: number, input: AddPasswordBody) {
        await db.insert(passwords).values({
            vaultId: input.vaultId,
            userId,
            name: input.name,
            url: input.url,
            username: input.username,
            password: input.password,
            faviconUrl: input.faviconUrl,
            note: input.note,
        });

        return {
            status: true,
            message: "password added successfully",
        };
    }

    async getPasswords(userId: number, vaultId: number, search?: string) {
        const searchCondition = search
            ? or(
                  like(passwords.name, `%${search}%`),
                  like(passwords.url, `%${search}%`),
                  like(passwords.username, `%${search}%`),
                  like(passwords.note, `%${search}%`)
              )
            : undefined;

        const passwordsData = await db.query.passwords.findMany({
            where: and(
                eq(passwords.userId, userId),
                eq(passwords.vaultId, vaultId),
                searchCondition
            ),
            orderBy: [desc(passwords.updatedAt)],
        });

        return {
            status: true,
            message: "passwords fetched successfully",
            data: passwordsData,
        };
    }

    async getPassword(userId: number, id: number) {
        const password = await db.query.passwords.findFirst({
            where: and(eq(passwords.id, id), eq(passwords.userId, userId)),
        });

        if (!password) {
            throw new NotFoundException("Password not found");
        }

        return {
            status: true,
            message: "password fetched successfully",
            data: password,
        };
    }

    async updatePassword(
        id: number,
        input: UpdatePasswordBody,
        userId: number
    ) {
        const [updatedPassword] = await db
            .update(passwords)
            .set({ ...input, updatedAt: new Date() })
            .where(and(eq(passwords.id, id), eq(passwords.userId, userId)));

        if (!updatedPassword.affectedRows) {
            throw new NotFoundException("Password not found");
        }

        return {
            status: true,
            message: "password updated successfully",
        };
    }

    async deletePassword(id: number, userId: number) {
        const [deletedPassword] = await db
            .delete(passwords)
            .where(and(eq(passwords.id, id), eq(passwords.userId, userId)));

        if (!deletedPassword.affectedRows) {
            throw new NotFoundException("Password not found");
        }

        return {
            status: true,
            message: "password deleted successfully",
        };
    }

    async deleteMultiplePasswords(userId: number, ids: number[]) {
        const [deletedPasswords] = await db
            .delete(passwords)
            .where(
                and(inArray(passwords.id, ids), eq(passwords.userId, userId))
            );

        if (!deletedPasswords.affectedRows) {
            throw new NotFoundException("Password not found");
        }

        return {
            status: true,
            message: "passwords deleted successfully",
        };
    }

    async importPasswords(userId: number, inputPasswords: ImportPasswordsBody) {
        const allPasswords = inputPasswords.map((password) => ({
            ...password,
            userId,
        }));

        await db.insert(passwords).values(allPasswords);

        return {
            status: true,
            message: "passwords imported successfully",
        };
    }

    async movePasswordsToVault(
        userId: number,
        body: MoveMultiplePasswordsVaultBody
    ) {
        await db
            .update(passwords)
            .set({ vaultId: body.vaultId })
            .where(
                and(
                    inArray(passwords.id, body.ids),
                    eq(passwords.userId, userId)
                )
            );

        return {
            status: true,
            message: "passwords moved to vault successfully",
        };
    }
}

export default new PasswordService();
