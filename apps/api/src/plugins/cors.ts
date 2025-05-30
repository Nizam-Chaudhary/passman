import type { FastifyInstance } from "fastify";

import fastifyCors from "@fastify/cors";
import fastifyPlugin from "fastify-plugin";

import env from "../lib/env";

export default fastifyPlugin((fastify: FastifyInstance, _opts, done) => {
    fastify.register(fastifyCors, {
        origin: env.FE_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Origin",
            "Accept",
            "X-Requested-With",
        ],
        exposedHeaders: ["Content-Range", "X-Content-Range"],
        maxAge: 86400,
    });

    done();
});
