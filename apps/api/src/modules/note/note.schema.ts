import { z } from "zod/v4";

export const getNotesQueryStringSchema = z
    .object({
        vaultId: z.coerce
            .number()
            .min(0, "Please provide vaultId")
            .describe("ID of the vault to fetch notes from"),
        search: z
            .string()
            .min(1, "provide atleast one character")
            .optional()
            .describe("Search string to filter notes"),
    })
    .describe("Schema for notes query parameters");

export type GetNotesQueryOptions = z.infer<typeof getNotesQueryStringSchema>;

export const addNoteSchema = z
    .object({
        vaultId: z
            .number()
            .int()
            .positive("Vault id is required")
            .describe("ID of the vault this note belongs to"),
        title: z
            .string()
            .min(1, "Title is required")
            .describe("Title of the note"),
        content: z
            .string()
            .nullable()
            .optional()
            .describe("Content of the note"),
    })
    .describe("Schema for adding a new note");

export type AddNoteBody = z.infer<typeof addNoteSchema>;

export const updateNoteSchema = z
    .object({
        title: z
            .string()
            .min(1, "Title is required")
            .describe("Title of the note"),
        content: z
            .string()
            .nullable()
            .optional()
            .describe("Content of the note"),
    })
    .describe("Schema for updating an existing note");

export type UpdateNoteBody = z.infer<typeof updateNoteSchema>;

export const deleteMultipleNotesBodySchema = z.object({
    ids: z
        .array(z.number().int().positive("ID must be a positive integer"))
        .min(1, "At least one ID is required"),
});

export type DeleteMultipleNotesBody = z.infer<
    typeof deleteMultipleNotesBodySchema
>;

export const moveNotesVaultBodySchema = z.object({
    vaultId: z.number().int().positive("Vault ID must be a positive integer"),
    ids: z
        .array(z.number().int().positive("ID must be a positive integer"))
        .min(1, "At least one ID is required"),
});

export type MoveNotesVaultBody = z.infer<typeof moveNotesVaultBodySchema>;
