import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { errorSchema, idParamsSchema } from "../../utils/basicSchema";
import vaultController from "./vault.controller";
import {
    addUpdateVaultBodySchema,
    addVaultResponseSchema,
    deleteVaultResponseSchema,
    getVaultsResponseSchema,
    updateVaultResponseSchema,
} from "./vault.schema";

export default async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "GET",
        url: "/",
        schema: {
            tags: ["Vaults"],
            summary: "Get vaults",
            description: "Get vaults",
            security: [{ jwtAuth: [] }],
            response: {
                "200": getVaultsResponseSchema,
                "4xx": errorSchema,
                "5xx": errorSchema,
            },
        },
        preHandler: [fastify.authenticate],
        handler: vaultController.getVaults,
    });

    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "POST",
        url: "/",
        schema: {
            tags: ["Vaults"],
            summary: "Add vault",
            description: "Add vault",
            security: [{ jwtAuth: [] }],
            body: addUpdateVaultBodySchema,
            response: {
                "200": addVaultResponseSchema,
                "4xx": errorSchema,
                "5xx": errorSchema,
            },
        },
        preHandler: [fastify.authenticate],
        handler: vaultController.addVault,
    });

    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "PUT",
        url: "/:id",
        schema: {
            tags: ["Vaults"],
            summary: "Update vault",
            description: "Update vault",
            security: [{ jwtAuth: [] }],
            params: idParamsSchema,
            body: addUpdateVaultBodySchema,
            response: {
                "200": updateVaultResponseSchema,
                "4xx": errorSchema,
                "5xx": errorSchema,
            },
        },
        preHandler: [fastify.authenticate],
        handler: vaultController.updateVault,
    });

    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "DELETE",
        url: "/:id",
        schema: {
            tags: ["Vaults"],
            summary: "Add vault",
            description: "Add vault",
            security: [{ jwtAuth: [] }],
            params: idParamsSchema,
            response: {
                "200": deleteVaultResponseSchema,
                "4xx": errorSchema,
                "5xx": errorSchema,
            },
        },
        preHandler: [fastify.authenticate],
        handler: vaultController.deleteVault,
    });

    // fastify.withTypeProvider<ZodTypeProvider>().route({
    //     method: "GET",
    //     url: "/passwords",
    //     schema: {
    //         tags: ["Vaults"],
    //         summary: "Get vaults with passwords",
    //         description: "Get vaults with passwords",
    //         security: [{ jwtAuth: [] }],
    //         querystring: getVaultWithResourceQuerySchema,
    //         response: {
    //             200: signUpUserResponseSchema,
    //             "4xx": errorSchema,
    //             "5xx": errorSchema,
    //         },
    //     },
    //     preHandler: [fastify.authenticate],
    //     handler: vaultController.getVaultsWithPasswords,
    // });
};
