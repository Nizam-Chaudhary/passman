import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { errorSchema, responseSchema } from "../../utils/basicSchema";
import authController from "./auth.controller";
import {
    createMasterKeyBodySchema,
    refreshTokenBodySchema,
    refreshTokenResponseSchema,
    resendOtpBodySchema,
    resetPasswordBodySchema,
    sendResetPasswordEmailBodySchema,
    signInResponseSchema,
    signInUserSchema,
    signUpUserResponseSchema,
    signUpUserSchema,
    updateMasterPasswordBodySchema,
    verifyMasterPasswordBodySchema,
    verifyMasterPasswordResponseSchema,
    verifyUserEmailBodySchema,
} from "./auth.schema";

export default async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "POST",
        url: "/sign-up",
        schema: {
            tags: ["Auth"],
            summary: "Sign up user",
            description: "Sign up user",
            body: signUpUserSchema,
            response: {
                "200": signUpUserResponseSchema,
                "4xx": errorSchema,
                "5xx": errorSchema,
            },
            required: ["email"],
        },
        handler: authController.signUpUser,
    });

    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "POST",
        url: "/sign-in",
        schema: {
            tags: ["Auth"],
            summary: "Sign in user",
            description: "Sign in user",
            body: signInUserSchema,
            response: {
                "200": signInResponseSchema,
                "4xx": errorSchema,
                "5xx": errorSchema,
            },
        },
        handler: authController.signInUser,
    });

    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "POST",
        url: "/refresh-token",
        schema: {
            tags: ["Auth"],
            summary: "Refresh access token",
            body: refreshTokenBodySchema,
            description: "Refresh access token",
            response: {
                "200": refreshTokenResponseSchema,
                "4xx": errorSchema,
                "5xx": errorSchema,
            },
        },
        handler: authController.refreshToken,
    });

    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "PATCH",
        url: "/verify",
        schema: {
            tags: ["Auth"],
            summary: "Verify user email",
            description: "Verify user email",
            body: verifyUserEmailBodySchema,
            response: {
                "200": responseSchema,
                "4xx": errorSchema,
                "5xx": errorSchema,
            },
        },
        handler: authController.verifyUserEmail,
    });

    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "PATCH",
        url: "/create-master-key",
        schema: {
            security: [{ jwtAuth: [] }],
            tags: ["Auth"],
            body: createMasterKeyBodySchema,
            summary: "Create master key for user",
            description: "creates master key for user",
            response: {
                "200": responseSchema,
                "4xx": errorSchema,
                "5xx": errorSchema,
            },
        },
        preHandler: [fastify.authenticate],
        handler: authController.createMasterKey,
    });

    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "POST",
        url: "/verify-master-password",
        schema: {
            security: [{ jwtAuth: [] }],
            tags: ["Auth"],
            body: verifyMasterPasswordBodySchema,
            summary: "Verify Master password for user",
            description: "Verify master password for user",
            response: {
                "200": verifyMasterPasswordResponseSchema,
                "4xx": errorSchema,
                "5xx": errorSchema,
            },
        },
        preHandler: [fastify.authenticate],
        handler: authController.verifyMasterPassword,
    });

    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "POST",
        url: "/resend-otp",
        schema: {
            tags: ["Auth"],
            body: resendOtpBodySchema,
            summary: "Resend otp to user's email",
            description: "Resend otp to user's email",
            response: {
                "200": responseSchema,
                "4xx": errorSchema,
                "5xx": errorSchema,
            },
        },
        handler: authController.resendOtp,
    });

    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "POST",
        url: "/reset-password-mail",
        schema: {
            tags: ["Auth"],
            body: sendResetPasswordEmailBodySchema,
            summary: "send reset password email",
            description: "send reset password email",
            response: {
                "200": responseSchema,
                "4xx": errorSchema,
                "5xx": errorSchema,
            },
        },
        handler: authController.sendResetPasswordEmail,
    });

    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "PATCH",
        url: "/reset-password",
        schema: {
            tags: ["Auth"],
            body: resetPasswordBodySchema,
            summary: "reset login password",
            description: "reset login password",
            response: {
                "200": responseSchema,
                "4xx": errorSchema,
                "5xx": errorSchema,
            },
        },
        handler: authController.resetPassword,
    });

    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "PATCH",
        url: "/master-password",
        schema: {
            tags: ["Auth"],
            body: updateMasterPasswordBodySchema,
            summary: "Update master password",
            description: "Update master password",
            response: {
                "200": responseSchema,
                "4xx": errorSchema,
                "5xx": errorSchema,
            },
        },
        preHandler: [fastify.authenticate],
        handler: authController.updateMasterPassword,
    });
};
