import type { FastifyReply, FastifyRequest } from "fastify";

import type {
    CreateMasterKeyBody,
    JwtUserData,
    RefreshTokenBody,
    ResetPasswordBody,
    ResetPasswordJwtTokenPayload,
    SignInUserInput,
    SignUpUserInput,
    UpdateMasterPasswordBody,
    VerifyMasterPasswordBody,
    VerifyUserEmailBody,
} from "./auth.schema";

import AppError from "../../lib/appError";
import authService from "./auth.service";

class UserController {
    async signUpUser(
        req: FastifyRequest<{ Body: SignUpUserInput }>,
        reply: FastifyReply
    ) {
        const response = await authService.signUpUser(req.body);
        await reply.code(200).send(response);
    }

    async signInUser(
        req: FastifyRequest<{ Body: SignInUserInput }>,
        reply: FastifyReply
    ) {
        const userData = await authService.signInUser(req.body);
        const tokenPayload = {
            id: userData.id,
            email: userData.email,
            userName: userData.userName,
            masterKeyCreated: !!userData.masterKey,
        };
        const token = req.jwt.sign(tokenPayload, { expiresIn: "15m" });
        const refreshToken = req.jwt.sign(tokenPayload, { expiresIn: "90d" });

        reply.code(200).send({
            status: "success",
            message: "User signed in successfully",
            data: {
                token,
                refreshToken,
                ...userData,
            },
        });
    }

    async refreshToken(
        req: FastifyRequest<{ Body: RefreshTokenBody }>,
        reply: FastifyReply
    ) {
        const refresh_token = req.body.refreshToken;
        const tokenPayload = req.jwt.verify<JwtUserData>(refresh_token);

        if (!tokenPayload) {
            throw new AppError("UNAUTORIZED", "Refresh token is invalid", 401);
        }

        const userData = await authService.refreshToken(tokenPayload.id);

        const token = req.jwt.sign(userData, { expiresIn: "15m" });
        const refreshToken = req.jwt.sign(userData, { expiresIn: "90d" });

        reply.code(200).send({
            status: "success",
            message: "Token refreshed successfully",
            data: {
                token,
                refreshToken,
            },
        });
    }

    async verifyUserEmail(
        req: FastifyRequest<{ Body: VerifyUserEmailBody }>,
        reply: FastifyReply
    ) {
        const response = await authService.verifyUserEmail(req.body);
        reply.code(200).send(response);
    }

    async createMasterKey(
        req: FastifyRequest<{ Body: CreateMasterKeyBody }>,
        reply: FastifyReply
    ) {
        const id = req.user.id;

        const response = await authService.createMasterKey(id, req.body);

        reply.code(200).send(response);
    }

    async verifyMasterPassword(
        req: FastifyRequest<{ Body: VerifyMasterPasswordBody }>,
        reply: FastifyReply
    ) {
        const id = req.user.id;

        const response = await authService.verifyMasterPassword(id, req.body);

        reply.code(200).send(response);
    }

    async resendOtp(
        req: FastifyRequest<{ Body: { email: string } }>,
        reply: FastifyReply
    ) {
        const email = req.body.email;

        const response = await authService.resendOtp(email);

        reply.code(200).send(response);
    }

    async sendResetPasswordEmail(
        req: FastifyRequest<{ Body: { email: string } }>,
        reply: FastifyReply
    ) {
        const email = req.body.email;

        const token = req.jwt.sign({ email }, { expiresIn: "15m" });

        const response = await authService.sendResetPasswordEmail(email, token);

        reply.code(200).send(response);
    }

    async resetPassword(
        req: FastifyRequest<{ Body: ResetPasswordBody }>,
        reply: FastifyReply
    ) {
        const { token, password } = req.body;
        const tokenData = req.jwt.verify<ResetPasswordJwtTokenPayload>(token);

        if (!tokenData) {
            throw new AppError(
                "TOKEN_EXPIRED",
                "Reset password token expired",
                400
            );
        }

        const response = await authService.resetPassword(
            tokenData.email,
            password
        );

        reply.code(200).send(response);
    }

    async updateMasterPassword(
        req: FastifyRequest<{ Body: UpdateMasterPasswordBody }>,
        reply: FastifyReply
    ) {
        const userId = req.user.id;
        const body = req.body;
        const response = await authService.updateMasterPassword(userId, body);

        reply.code(200).send(response);
    }
}

export default new UserController();
