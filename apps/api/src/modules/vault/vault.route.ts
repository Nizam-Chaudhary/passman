import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { addVaultBodySchema, updateVaultBodySchema } from "./vault.schema";
import vaultService from "./vault.service";
import { idParamsSchema } from "../../utils/basicSchema";
import { bearerAuth } from "../../middlewares/auth";
import { zValidatorCustomFunc } from "../../middlewares/zValidatorCustomFunc";

export const vaultRoutes = new Hono()
    .use("*", bearerAuth)
    .get("/", async (c) => {
        const user = c.get("user");
        const response = await vaultService.getVaults(user.id);
        return c.json(response);
    })
    .post(
        "/",
        zValidator("json", addVaultBodySchema, zValidatorCustomFunc),
        async (c) => {
            const body = await c.req.json();
            const user = c.get("user");
            const response = await vaultService.addVault(body.name, user.id);
            return c.json(response, 201);
        }
    )
    .patch(
        "/:id",
        zValidator("param", idParamsSchema, zValidatorCustomFunc),
        zValidator("json", updateVaultBodySchema, zValidatorCustomFunc),
        async (c) => {
            const { id } = c.req.valid("param");
            const body = c.req.valid("json");
            const user = c.get("user");
            const response = await vaultService.updateVault(
                id,
                body.name,
                user.id
            );
            return c.json(response);
        }
    )
    .delete(
        "/:id",
        zValidator("param", idParamsSchema, zValidatorCustomFunc),
        async (c) => {
            const { id } = c.req.valid("param");
            const user = c.get("user");
            const response = await vaultService.deleteVault(id, user.id);
            return c.json(response);
        }
    );
