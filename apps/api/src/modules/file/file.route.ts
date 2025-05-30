import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { z } from "zod";
import { errorSchema } from "../../utils/basicSchema";
import fileController from "./file.controller";
import { uploadFileResponseSchema } from "./file.schema";

export default async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "POST",
        url: "/upload",
        attachValidation: true,
        schema: {
            tags: ["Files"],
            summary: "Upload file",
            description: "Upload file",
            security: [{ jwtAuth: [] }],
            body: z.object({ file: z.string() }),
            consumes: ["multipart/form-data"],
            response: {
                "200": uploadFileResponseSchema,
                "4xx": errorSchema,
                "5xx": errorSchema,
            },
        },
        preHandler: [fastify.authenticate],
        handler: fileController.uploadFile,
    });
};
