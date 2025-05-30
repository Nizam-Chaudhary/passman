import type { FastifyInstance } from "fastify";

import authRoute from "./modules/auth/auth.route";
import fileRoute from "./modules/file/file.route";
import healthRoute from "./modules/health/health.route";
import passwordRoute from "./modules/password/password.route";
import userRoute from "./modules/user/user.route";
import vaultRoute from "./modules/vault/vault.route";

export default (fastify: FastifyInstance) => {
    fastify.register(authRoute, { prefix: "api/v1/auth" });
    fastify.register(fileRoute, { prefix: "api/v1/files" });
    fastify.register(healthRoute, { prefix: "health" });
    fastify.register(passwordRoute, { prefix: "api/v1/passwords" });
    fastify.register(userRoute, { prefix: "api/v1/users" });
    fastify.register(vaultRoute, { prefix: "api/v1/vaults" });
};
