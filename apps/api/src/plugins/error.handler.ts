import type { FastifyReply, FastifyRequest } from "fastify";

import type AppError from "../lib/appError";

import fastifyPlugin from "fastify-plugin";

import { globalErrorHandler } from "../lib/errorHandler";

export default fastifyPlugin((fastify, _opts, done) => {
    fastify.setErrorHandler(
        (error: AppError, request: FastifyRequest, reply: FastifyReply) => {
            globalErrorHandler(fastify, error, request, reply);
        }
    );

    done();
});
