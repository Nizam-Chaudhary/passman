import { z } from "zod/v4";

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "application/json",
] as const;

export const validFileTypesSchema = z
    .enum(allowedMimeTypes)
    .describe("Schema for allowed file MIME types");

export const uploadFileBodySchema = z.object({
    file: z.file(),
});
