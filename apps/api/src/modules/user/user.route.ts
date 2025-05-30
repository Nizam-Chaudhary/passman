import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { errorSchema } from "../../utils/basicSchema";
import userController from "./user.controller";
import {
    getUserResponseSchema,
    updateUserResponseSchema,
    updateUserSchema,
} from "./user.schema";

export default async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "PATCH",
        url: "/",

        schema: {
            tags: ["User"],
            summary: "Update user details",
            description: "update user details",
            security: [{ jwtAuth: [] }],
            body: updateUserSchema,
            response: {
                "200": updateUserResponseSchema,
                "4xx": errorSchema,
                "5xx": errorSchema,
            },
        },
        preHandler: [fastify.authenticate],
        handler: userController.updateUser,
    });

    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "GET",
        url: "/",
        schema: {
            security: [{ jwtAuth: [] }],
            tags: ["User"],
            summary: "Get logged in user detail",
            description: "fetch user details",
            response: {
                "200": getUserResponseSchema,
                "4xx": errorSchema,
                "5xx": errorSchema,
            },
        },
        preHandler: [fastify.authenticate],
        handler: userController.getUser,
    });
};
