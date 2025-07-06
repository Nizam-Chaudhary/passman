import { Hono } from "hono";

import { authRoutes } from "./modules/auth/auth.route";
import { fileRoutes } from "./modules/file/file.route";
import { healthRoute } from "./modules/health/health.route";
import { passwordRoutes } from "./modules/password/password.route";
import { userRoutes } from "./modules/user/user.route";
import { vaultRoutes } from "./modules/vault/vault.route";

export const routes = new Hono()
  .route("/v1/auth", authRoutes)
  .route("/v1/users", userRoutes)
  .route("/v1/passwords", passwordRoutes)
  .route("/v1/vaults", vaultRoutes)
  .route("/v1/files", fileRoutes)
  .route("/v1/health", healthRoute);
