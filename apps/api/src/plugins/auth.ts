import type { FastifyJWT } from "@fastify/jwt";
import type { FastifyReply, FastifyRequest } from "fastify";

import fastifyPlugin from "fastify-plugin";

import AppError from "../lib/appError";

export default fastifyPlugin((fastify, _opts, done) => {
    fastify.decorate(
        "authenticate",
        async (req: FastifyRequest, _reply: FastifyReply) => {
            const token = req.headers.authorization?.replace("Bearer ", "");

            if (!token) {
                throw new AppError(
                    "UNAUTHORIZED",
                    "please provide access token",
                    401
                );
            }

            try {
                const decoded = req.jwt.verify<FastifyJWT["user"]>(token);
                req.user = decoded;
                // biome-ignore lint/suspicious/noExplicitAny: error
            } catch (error: any) {
                if (error.code === "FAST_JWT_EXPIRED") {
                    throw new AppError(
                        "UNAUTHORIZED",
                        "Access token expired",
                        401
                    );
                    // biome-ignore lint/style/noUselessElse: better explanation
                } else if (error.code === "FAST_JWT_INVALID_SIGNATURE") {
                    throw new AppError(
                        "UNAUTHORIZED",
                        "access token has invalid signature",
                        401
                    );
                }
                throw new AppError("UNAUTHORIZED", "Unauthorized...", 401);
            }
        }
    );

    done();
});
