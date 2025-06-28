import { zValidator } from "@hono/zod-validator";
import {
  addVaultBodySchema,
  headerSchema,
  idParamsSchema,
  updateVaultBodySchema,
} from "@passman/schema/api";
import { Hono } from "hono";
import { bearerAuth } from "../../middlewares/auth";
import { zValidatorCustomFunc } from "../../middlewares/zValidatorCustomFunc";
import vaultService from "./vault.service";

export const vaultRoutes = new Hono()
  .get("/", bearerAuth, zValidator("header", headerSchema, zValidatorCustomFunc), async (c) => {
    const user = c.get("user");
    const response = await vaultService.getVaults(user.id);
    return c.json(response);
  })
  .post(
    "/",
    bearerAuth,
    zValidator("header", headerSchema, zValidatorCustomFunc),
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
    bearerAuth,
    zValidator("header", headerSchema, zValidatorCustomFunc),
    zValidator("param", idParamsSchema, zValidatorCustomFunc),
    zValidator("json", updateVaultBodySchema, zValidatorCustomFunc),
    async (c) => {
      const { id } = c.req.valid("param");
      const body = c.req.valid("json");
      const user = c.get("user");
      const response = await vaultService.updateVault(id, body.name, user.id);
      return c.json(response);
    }
  )
  .delete(
    "/:id",
    bearerAuth,
    zValidator("header", headerSchema, zValidatorCustomFunc),
    zValidator("param", idParamsSchema, zValidatorCustomFunc),
    async (c) => {
      const { id } = c.req.valid("param");
      const user = c.get("user");
      const response = await vaultService.deleteVault(id, user.id);
      return c.json(response);
    }
  );
