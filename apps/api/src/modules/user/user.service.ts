import type { UpdateUserInput } from "./user.schema";

import { eq } from "drizzle-orm";

import { db } from "../../db/index";
import { files, users } from "../../db/schema/schema";
import { deleteFiles } from "../file/file.service";

class UserService {
    async getUser(id: number) {
        const userData = await db.query.users.findFirst({
            columns: {
                id: true,
                userName: true,
                email: true,
                fileId: true,
                masterKey: true,
                recoveryKey: true,
                createdAt: true,
                updatedAt: true,
            },
            where: eq(users.id, id),
            with: {
                file: true,
            },
        });

        return {
            status: "success",
            data: userData,
        };
    }

    async updateUser(id: number, input: UpdateUserInput) {
        if (input.fileId) {
            const user = (
                await db
                    .select({ fileId: users.fileId })
                    .from(users)
                    .where(eq(users.id, id))
            )[0];

            if (user.fileId) {
                const file = await db
                    .delete(files)
                    .where(eq(files.id, user.fileId))
                    .returning();

                await deleteFiles([file[0].fileKey]);
            }
        }

        const user = await db
            .update(users)
            .set(input)
            .where(eq(users.id, id))
            .returning();

        return {
            status: "success",
            message: "user name updated successfully",
            data: user[0],
        };
    }
}

export default new UserService();
