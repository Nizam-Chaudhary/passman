import { Hono } from "hono";
import { loginUserBodySchema, refreshTokenBodySchema } from "./auth.schema";
import authService from "./auth.service";
import { zValidatorCustomFunc } from "../../middlewares/zValidatorCustomFunc";
import { zValidator } from "@hono/zod-validator";

export const authRoutes = new Hono()
    .post(
        "/login",
        zValidator("json", loginUserBodySchema, zValidatorCustomFunc),
        async (c) => {
            const body = c.req.valid("json");
            const response = await authService.loginUser(body);
            return c.json(response);
        }
    )
    .post(
        "/refresh-token",
        zValidator("json", refreshTokenBodySchema, zValidatorCustomFunc),
        async (c) => {
            const body = c.req.valid("json");
            const response = await authService.refreshToken(body);
            return c.json(response);
        }
    );
