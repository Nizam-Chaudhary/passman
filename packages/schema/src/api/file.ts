import { z } from "zod/v4";

export const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "application/json",
] as const;

export const validFileTypesSchema = z.enum(allowedMimeTypes, {
    error: "Invalid file type",
});

export const uploadFileBodySchema = z.object({
    file: z.file(),
});
