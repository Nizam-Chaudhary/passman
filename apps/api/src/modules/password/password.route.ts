import { zValidator } from "@hono/zod-validator";
import {
  addPasswordSchema,
  deleteMultiplePasswordsBodySchema,
  getPasswordsQueryStringSchema,
  headerSchema,
  idParamsSchema,
  importPasswordsSchema,
  moveMultiplePasswordsVaultBodySchema,
  updatePasswordSchema,
} from "@passman/schema/api";
import { Hono } from "hono";
import { bearerAuth } from "../../middlewares/auth";
import { zValidatorCustomFunc } from "../../middlewares/zValidatorCustomFunc";
import passwordService from "./password.service";

export const passwordRoutes = new Hono()
  .post(
    "/",
    bearerAuth,
    zValidator("header", headerSchema, zValidatorCustomFunc),
    zValidator("json", addPasswordSchema, zValidatorCustomFunc),
    async (c) => {
      const body = c.req.valid("json");
      const user = c.get("user");
      const response = await passwordService.addPassword(user.id, body);
      return c.json(response, 201);
    },
  )
  .get(
    "/",
    bearerAuth,
    zValidator("header", headerSchema, zValidatorCustomFunc),
    zValidator("query", getPasswordsQueryStringSchema, zValidatorCustomFunc),
    async (c) => {
      const { vaultId, search } = c.req.valid("query");
      const user = c.get("user");
      const response = await passwordService.getPasswords(user.id, vaultId, search);
      return c.json(response);
    },
  )
  .get(
    "/:id",
    bearerAuth,
    zValidator("header", headerSchema, zValidatorCustomFunc),
    zValidator("param", idParamsSchema, zValidatorCustomFunc),
    async (c) => {
      const { id } = c.req.valid("param");
      const user = c.get("user");
      const response = await passwordService.getPassword(user.id, id);
      return c.json(response);
    },
  )
  .patch(
    "/:id",
    bearerAuth,
    zValidator("header", headerSchema, zValidatorCustomFunc),
    zValidator("param", idParamsSchema, zValidatorCustomFunc),
    zValidator("json", updatePasswordSchema, zValidatorCustomFunc),
    async (c) => {
      const { id } = c.req.valid("param");
      const body = c.req.valid("json");
      const user = c.get("user");
      const response = await passwordService.updatePassword(id, body, user.id);
      return c.json(response);
    },
  )
  .delete(
    "/multiple",
    bearerAuth,
    zValidator("header", headerSchema, zValidatorCustomFunc),
    zValidator("json", deleteMultiplePasswordsBodySchema, zValidatorCustomFunc),
    async (c) => {
      const { ids } = c.req.valid("json");
      const user = c.get("user");
      const response = await passwordService.deleteMultiplePasswords(user.id, ids);
      return c.json(response);
    },
  )
  .delete(
    "/:id",
    bearerAuth,
    zValidator("header", headerSchema, zValidatorCustomFunc),
    zValidator("param", idParamsSchema, zValidatorCustomFunc),
    async (c) => {
      const { id } = c.req.valid("param");
      const user = c.get("user");
      const response = await passwordService.deletePassword(id, user.id);
      return c.json(response);
    },
  )
  .post(
    "/import",
    bearerAuth,
    zValidator("header", headerSchema, zValidatorCustomFunc),
    zValidator("json", importPasswordsSchema, zValidatorCustomFunc),
    async (c) => {
      const body = c.req.valid("json");
      const user = c.get("user");
      const response = await passwordService.importPasswords(user.id, body);
      return c.json(response, 201);
    },
  )
  .post(
    "/move-vaults",
    bearerAuth,
    zValidator("header", headerSchema, zValidatorCustomFunc),
    zValidator("json", moveMultiplePasswordsVaultBodySchema, zValidatorCustomFunc),
    async (c) => {
      const body = c.req.valid("json");
      const user = c.get("user");
      const response = await passwordService.movePasswordsToVault(user.id, body);
      return c.json(response);
    },
  );
