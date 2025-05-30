import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { files } from "../../db/schema/schema";
import { responseSchema } from "../../utils/basicSchema";

export const selectFileSchema = createSelectSchema(files).describe(
    "Schema for file selection"
);

export const uploadFileResponseSchema = responseSchema
    .and(z.object({ data: selectFileSchema }))
    .describe("Schema for file upload response");

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
