import { createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "../../db/schema/schema";
import {
    masterKeySchema,
    responseSchema,
    statusSchema,
} from "../../utils/basicSchema";
import { selectFileSchema } from "../file/file.schema";

const baseSchema = createUpdateSchema(users, {
    userName: (schema) =>
        schema
            .min(2, "User name must be at least 4 characters")
            .describe("Username for the account"),
    fileId: (schema) =>
        schema
            .min(1, "File ID must be at least 1")
            .describe("ID of the associated file"),
});

// Update
export const updateUserSchema = z
    .object({
        userName: baseSchema.shape.userName,
        fileId: baseSchema.shape.fileId,
    })
    .describe("Schema for updating user information");

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

const selectUserModel = createSelectSchema(users, {
    masterKey: masterKeySchema,
    recoveryKey: masterKeySchema,
})
    .pick({
        id: true,
        userName: true,
        email: true,
        masterKey: true,
        recoveryKey: true,
        createdAt: true,
        updatedAt: true,
    })
    .describe("User model with selected fields for responses");

export const updateUserResponseSchema = responseSchema
    .and(z.object({ data: selectUserModel }))
    .describe("Schema for user update response");

export const getUserResponseSchema = z
    .object({
        status: statusSchema,
        data: selectUserModel.and(
            z.object({
                file: selectFileSchema.nullable(),
            })
        ),
    })
    .describe("Schema for getting user data response");
