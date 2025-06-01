import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
    addPasswordSchema,
    deleteMultiplePasswordsBodySchema,
    getPasswordsQueryStringSchema,
    importPasswordsSchema,
    movePasswordsVaultBodySchema,
    updatePasswordSchema,
} from "./password.schema";
import passwordService from "./password.service";
import { idParamsSchema } from "../../utils/basicSchema";
import { bearerAuth } from "../../middlewares/auth";
import { zValidatorCustomFunc } from "../../middlewares/zValidatorCustomFunc";

export const passwordRoutes = new Hono()
    .use("*", bearerAuth)
    .post(
        "/",
        zValidator("json", addPasswordSchema, zValidatorCustomFunc),
        async (c) => {
            const body = c.req.valid("json");
            const user = c.get("user");
            const response = await passwordService.addPassword(user.id, body);
            return c.json(response, 201);
        }
    )
    .get(
        "/",
        zValidator(
            "query",
            getPasswordsQueryStringSchema,
            zValidatorCustomFunc
        ),
        async (c) => {
            const { vaultId, search } = c.req.valid("query");
            const user = c.get("user");
            const response = await passwordService.getPasswords(
                user.id,
                vaultId,
                search
            );
            return c.json(response);
        }
    )
    .get(
        "/:id",
        zValidator("param", idParamsSchema, zValidatorCustomFunc),
        async (c) => {
            const { id } = c.req.valid("param");
            const user = c.get("user");
            const response = await passwordService.getPassword(user.id, id);
            return c.json(response);
        }
    )
    .patch(
        "/:id",
        zValidator("param", idParamsSchema, zValidatorCustomFunc),
        zValidator("json", updatePasswordSchema, zValidatorCustomFunc),
        async (c) => {
            const { id } = c.req.valid("param");
            const body = c.req.valid("json");
            const user = c.get("user");
            const response = await passwordService.updatePassword(
                id,
                body,
                user.id
            );
            return c.json(response);
        }
    )
    .delete(
        "/multiple",
        zValidator(
            "json",
            deleteMultiplePasswordsBodySchema,
            zValidatorCustomFunc
        ),
        async (c) => {
            const { ids } = c.req.valid("json");
            const user = c.get("user");
            const response = await passwordService.deleteMultiplePasswords(
                user.id,
                ids
            );
            return c.json(response);
        }
    )
    .delete(
        "/:id{[0-9]+}",
        zValidator("param", idParamsSchema, zValidatorCustomFunc),
        async (c) => {
            const { id } = c.req.valid("param");
            const user = c.get("user");
            const response = await passwordService.deletePassword(id, user.id);
            return c.json(response);
        }
    )
    .post(
        "/import",
        bearerAuth,
        zValidator("json", importPasswordsSchema, zValidatorCustomFunc),
        async (c) => {
            const body = c.req.valid("json");
            const user = c.get("user");
            const response = await passwordService.importPasswords(
                user.id,
                body
            );
            return c.json(response, 201);
        }
    )
    .post(
        "/move-vaults",
        zValidator("json", movePasswordsVaultBodySchema, zValidatorCustomFunc),
        async (c) => {
            const body = c.req.valid("json");
            const user = c.get("user");
            const response = await passwordService.movePasswordsToVault(
                user.id,
                body
            );
            return c.json(response);
        }
    );
