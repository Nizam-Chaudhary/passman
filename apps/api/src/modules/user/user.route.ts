import { Hono } from "hono";
import {
    createMasterKeyBodySchema,
    resendOtpBodySchema,
    resetPasswordBodySchema,
    sendResetPasswordEmailBodySchema,
    signUpUserBodySchema,
    updateMasterPasswordBodySchema,
    updateUserDetailsBodySchema,
    verifyMasterPasswordBodySchema,
    verifyUserEmailBodySchema,
} from "./user.schema";
import userService from "./user.service";
import { idParamsSchema } from "../../utils/basicSchema";
import { bearerAuth } from "../../middlewares/auth";
import { zValidator } from "@hono/zod-validator";
import { zValidatorCustomFunc } from "../../middlewares/zValidatorCustomFunc";
export const userRoutes = new Hono()
    .post(
        "/register",
        zValidator("json", signUpUserBodySchema, zValidatorCustomFunc),
        async (c) => {
            const body = c.req.valid("json");
            const response = await userService.signUpUser(body);
            return c.json(response, 201);
        }
    )
    .patch(
        "/:id",
        bearerAuth,
        zValidator("json", updateUserDetailsBodySchema, zValidatorCustomFunc),
        zValidator("param", idParamsSchema, zValidatorCustomFunc),
        async (c) => {
            const { id } = c.req.valid("param");
            const body = c.req.valid("json");
            const response = await userService.updateUser(id, body);

            return c.json(response, 200);
        }
    )
    .get("/", bearerAuth, async (c) => {
        const { id } = c.get("user");
        const response = await userService.getUser(id);

        return c.json(response, 200);
    })
    .post(
        "/verify-email",
        zValidator("json", verifyUserEmailBodySchema, zValidatorCustomFunc),
        async (c) => {
            const body = c.req.valid("json");
            const response = await userService.verifyUserEmail(body);

            return c.json(response, 200);
        }
    )
    .post(
        "/master-key",
        bearerAuth,
        zValidator("json", createMasterKeyBodySchema, zValidatorCustomFunc),
        async (c) => {
            // TODO: get id from token
            const body = c.req.valid("json");
            const response = await userService.createMasterKey(1, body);

            return c.json(response, 201);
        }
    )
    .post(
        "/verify-master-password",
        bearerAuth,
        zValidator(
            "json",
            verifyMasterPasswordBodySchema,
            zValidatorCustomFunc
        ),
        async (c) => {
            // TODO: get id from token
            const body = c.req.valid("json");
            const response = await userService.verifyMasterPassword(1, body);

            return c.json(response, 200);
        }
    )
    .post(
        "/send-otp",
        bearerAuth,
        zValidator("json", resendOtpBodySchema, zValidatorCustomFunc),
        async (c) => {
            const body = c.req.valid("json");
            const response = await userService.resendOtp(body);

            return c.json(response, 200);
        }
    )
    .post(
        "/resend-otp",
        zValidator("json", resendOtpBodySchema, zValidatorCustomFunc),
        async (c) => {
            const body = c.req.valid("json");
            const response = await userService.resendOtp(body);

            return c.json(response, 200);
        }
    )
    .post(
        "/reset-password-email",
        zValidator(
            "json",
            sendResetPasswordEmailBodySchema,
            zValidatorCustomFunc
        ),
        async (c) => {
            const body = c.req.valid("json");
            const response = await userService.sendResetPasswordEmail(body);

            return c.json(response, 200);
        }
    )
    .post(
        "/reset-password",
        zValidator("json", resetPasswordBodySchema, zValidatorCustomFunc),
        async (c) => {
            const body = c.req.valid("json");
            const response = await userService.resetPassword(body);

            return c.json(response, 200);
        }
    )
    .patch(
        "/update-master-password",
        bearerAuth,
        zValidator(
            "json",
            updateMasterPasswordBodySchema,
            zValidatorCustomFunc
        ),
        async (c) => {
            const body = c.req.valid("json");
            const user = c.get("user");
            const response = await userService.updateMasterPassword(
                user.id,
                body
            );

            return c.json(response, 200);
        }
    );
