import { zValidator } from "@hono/zod-validator";
import { loginUserBodySchema, refreshTokenBodySchema } from "@passman/schema/api/auth";
import { Hono } from "hono";

import { zValidatorCustomFunc } from "../../middlewares/z-validator-custom-func";
import authService from "./auth.service";

export const authRoutes = new Hono()
  .post("/login", zValidator("json", loginUserBodySchema, zValidatorCustomFunc), async (c) => {
    const body = c.req.valid("json");
    const response = await authService.loginUser(body);
    return c.json(response);
  })
  .post(
    "/refresh-token",
    zValidator("json", refreshTokenBodySchema, zValidatorCustomFunc),
    async (c) => {
      const body = c.req.valid("json");
      const response = await authService.refreshToken(body);
      return c.json(response);
    },
  );
