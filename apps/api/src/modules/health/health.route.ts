import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { z } from "zod";

export default async function health(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "GET",
        url: "/",
        schema: {
            tags: ["Health"],
            summary: "Check server health",
            description: "Check Server health",
            response: {
                200: z.object({
                    status: z.literal("Hello, World!"),
                }),
            },
        },
        prefixTrailingSlash: "both",
        handler: (_request: FastifyRequest, reply: FastifyReply) => {
            reply.status(200).send({ status: "Hello, World!" });
        },
    });
}
