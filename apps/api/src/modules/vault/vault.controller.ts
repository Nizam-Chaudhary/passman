import type { FastifyReply, FastifyRequest } from "fastify";

import type { getVaultResourceQueryOptions } from "./vault.schema";

import vaultService from "./vault.service";

class VaultController {
    async getVaults(
        request: FastifyRequest<{ Querystring: getVaultResourceQueryOptions }>,
        reply: FastifyReply
    ) {
        const response = await vaultService.getVaults(request.user.id);

        reply.status(200).send(response);
    }

    async addVault(
        request: FastifyRequest<{ Body: { name: string } }>,
        reply: FastifyReply
    ) {
        const response = await vaultService.addVault(
            request.body.name,
            request.user.id
        );

        reply.status(200).send(response);
    }

    async updateVault(
        request: FastifyRequest<{
            Params: { id: number };
            Body: { name: string };
        }>,
        reply: FastifyReply
    ) {
        const response = await vaultService.updateVault(
            request.params.id,
            request.body.name,
            request.user.id
        );

        reply.status(200).send(response);
    }

    async deleteVault(
        request: FastifyRequest<{
            Params: { id: number };
        }>,
        reply: FastifyReply
    ) {
        const response = await vaultService.deleteVault(
            request.params.id,
            request.user.id
        );

        reply.status(200).send(response);
    }

    // async getVaultsWithPasswords(
    //     request: FastifyRequest<{ Querystring: getVaultResourceQueryOptions }>,
    //     reply: FastifyReply
    // ) {
    //     const response = await userService.getVaultsWithPasswords(
    //         request.user.id,
    //         request.query.vaultId
    //     );

    //     reply.status(200).send(response);
    // }
}

export default new VaultController();
