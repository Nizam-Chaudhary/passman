import { zValidator } from "@hono/zod-validator";
import {
  createMasterKeyBodySchema,
  headerSchema,
  registerUserBodySchema,
  resendOtpBodySchema,
  resetPasswordBodySchema,
  sendResetPasswordEmailBodySchema,
  updateMasterPasswordBodySchema,
  updateUserDetailsBodySchema,
  verifyMasterPasswordBodySchema,
  verifyUserEmailBodySchema,
} from "@passman/schema/api";
import { Hono } from "hono";
import { bearerAuth } from "../../middlewares/auth";
import { zValidatorCustomFunc } from "../../middlewares/zValidatorCustomFunc";
import userService from "./user.service";

export const userRoutes = new Hono()
  .post(
    "/register",
    zValidator("json", registerUserBodySchema, zValidatorCustomFunc),
    async (c) => {
      const body = c.req.valid("json");
      const response = await userService.registerUser(body);
      return c.json(response, 201);
    },
  )
  .post(
    "/reset-password-email",
    zValidator("json", sendResetPasswordEmailBodySchema, zValidatorCustomFunc),
    async (c) => {
      const body = c.req.valid("json");
      const response = await userService.sendResetPasswordEmail(body);

      return c.json(response, 200);
    },
  )
  .post(
    "/reset-password",
    zValidator("json", resetPasswordBodySchema, zValidatorCustomFunc),
    async (c) => {
      const body = c.req.valid("json");
      const response = await userService.resetPassword(body);

      return c.json(response, 200);
    },
  )
  .post(
    "/verify-email",
    zValidator("json", verifyUserEmailBodySchema, zValidatorCustomFunc),
    async (c) => {
      const body = c.req.valid("json");
      const response = await userService.verifyUserEmail(body);

      return c.json(response, 200);
    },
  )
  .post("/send-otp", zValidator("json", resendOtpBodySchema, zValidatorCustomFunc), async (c) => {
    const body = c.req.valid("json");
    const response = await userService.resendOtp(body);

    return c.json(response, 200);
  })
  .post("/resend-otp", zValidator("json", resendOtpBodySchema, zValidatorCustomFunc), async (c) => {
    const body = c.req.valid("json");
    const response = await userService.resendOtp(body);

    return c.json(response, 200);
  })
  .patch(
    "/",
    bearerAuth,
    zValidator("header", headerSchema, zValidatorCustomFunc),
    zValidator("json", updateUserDetailsBodySchema, zValidatorCustomFunc),
    async (c) => {
      const { id } = c.get("user");
      const body = c.req.valid("json");
      const response = await userService.updateUser(id, body);

      return c.json(response, 200);
    },
  )
  .post(
    "/master-key",
    bearerAuth,
    zValidator("header", headerSchema, zValidatorCustomFunc),
    zValidator("json", createMasterKeyBodySchema, zValidatorCustomFunc),
    async (c) => {
      const { id } = c.get("user");
      const body = c.req.valid("json");
      const response = await userService.createMasterKey(id, body);

      return c.json(response, 201);
    },
  )
  .post(
    "/verify-master-password",
    bearerAuth,
    zValidator("header", headerSchema, zValidatorCustomFunc),
    zValidator("json", verifyMasterPasswordBodySchema, zValidatorCustomFunc),
    async (c) => {
      const { id } = c.get("user");
      const body = c.req.valid("json");
      const response = await userService.verifyMasterPassword(id, body);

      return c.json(response, 200);
    },
  )
  .get("/", bearerAuth, zValidator("header", headerSchema, zValidatorCustomFunc), async (c) => {
    const { id } = c.get("user");
    const response = await userService.getUser(id);

    return c.json(response, 200);
  })
  .patch(
    "/update-master-password",
    bearerAuth,
    zValidator("header", headerSchema, zValidatorCustomFunc),
    zValidator("json", updateMasterPasswordBodySchema, zValidatorCustomFunc),
    async (c) => {
      const body = c.req.valid("json");
      const user = c.get("user");
      const response = await userService.updateMasterPassword(user.id, body);

      return c.json(response, 200);
    },
  );
