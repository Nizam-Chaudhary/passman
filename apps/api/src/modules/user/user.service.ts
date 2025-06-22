import type {
    CreateMasterKeyBody,
    RegisterUserBody,
    ResendOtpBody,
    ResetPasswordBody,
    ResetPasswordJwtTokenPayload,
    SendResetPasswordEmailBody,
    UpdateMasterPasswordBody,
    UpdateUserDetailsBody,
    VerifyMasterPasswordBody,
    VerifyUserEmailBody,
} from "@passman/schema/api";
import { eq, like } from "drizzle-orm";
import { db } from "../../db/index";
import { files, users, vaults } from "../../db/schema";
import { env } from "../../lib/env";
import { sendMail } from "../../lib/mailer";
import {
    BadRequestException,
    ConflictException,
    NotFoundException,
} from "../../lib/responseExceptions";
import * as userTemplates from "../../templates/user";
import { generateOtp } from "../../utils/generator";
import { createToken, verifyToken } from "../../utils/tokenHelper";
import fileService from "../file/file.service";

class UserService {
    async registerUser(input: RegisterUserBody) {
        const alreadyRegistered = await db.query.users.findFirst({
            columns: {
                id: true,
            },
            where: like(users.email, input.email.toLowerCase()),
        });

        if (alreadyRegistered) {
            throw new ConflictException("Email already registered");
        }

        const hashedPassword = await Bun.password.hash(input.password);

        const otp = generateOtp();

        await db.transaction(async (tx) => {
            const [user] = await tx
                .insert(users)
                .values({
                    email: input.email.toLowerCase(),
                    userName: input.userName,
                    password: hashedPassword,
                    otp,
                    isVerified: false,
                })
                .$returningId();

            if (!user) throw new Error("User creation failed");

            await tx.insert(vaults).values({
                name: "Default",
                userId: user.id,
            });
        });

        const signUpEmailBody = userTemplates.signUp({
            userName: input.userName,
            otp,
        });

        sendMail({
            toAddresses: input.email,
            subject: "Passman account verfication OTP",
            emailBody: signUpEmailBody,
        });

        return {
            status: true,
            message: "User signed up successfully",
        };
    }

    async getUser(id: number) {
        const userData = await db.query.users.findFirst({
            columns: {
                id: true,
                userName: true,
                email: true,
                fileId: true,
                masterKey: true,
                recoveryKey: true,
                createdAt: true,
                updatedAt: true,
            },
            where: eq(users.id, id),
            with: {
                file: true,
            },
        });

        return {
            status: true,
            data: userData,
        };
    }

    async updateUser(id: number, input: UpdateUserDetailsBody) {
        if (input.fileId) {
            const user = await db.query.users.findFirst({
                columns: {
                    fileId: true,
                },
                where: eq(users.id, id),
            });

            if (user?.fileId) {
                const file = await db.query.files.findFirst({
                    columns: {
                        fileKey: true,
                    },
                    where: eq(files.id, user.fileId),
                });

                await db.delete(files).where(eq(files.id, user.fileId));

                if (file) await fileService.deleteFileFromS3(file.fileKey);
            }
        }

        await db.update(users).set(input).where(eq(users.id, id));

        return {
            status: true,
            message: "User details updated successfully",
        };
    }

    async verifyUserEmail(input: VerifyUserEmailBody) {
        const userData = await db.query.users.findFirst({
            columns: {
                id: true,
                email: true,
                otp: true,
                updatedAt: true,
            },
            where: like(users.email, input.email.toLowerCase()),
        });

        if (!userData) {
            throw new BadRequestException(
                "Email not registered. Please register first!"
            );
        }

        if (input.otp !== userData.otp) {
            throw new BadRequestException("Invalid OTP");
        }

        await db
            .update(users)
            .set({
                isVerified: true,
            })
            .where(eq(users.id, userData.id));

        return {
            status: true,
            message: "Email verified successfully",
        };
    }

    async verifyMasterPassword(id: number, input: VerifyMasterPasswordBody) {
        const user = await db.query.users.findFirst({
            where: eq(users.id, id),
            columns: {
                masterKey: true,
                masterPassword: true,
            },
        });

        if (!user?.masterPassword) {
            throw new BadRequestException("Master password not created yet");
        }

        const isMasterPasswordValid = await Bun.password.verify(
            input.masterPassword,
            user.masterPassword
        );

        if (!isMasterPasswordValid) {
            throw new BadRequestException("Incorrect master password");
        }

        return {
            status: true,
            message: "Master password verified successfully",
            data: {
                //TODO: remove if not used
                masterKey: user.masterKey,
            },
        };
    }

    async createMasterKey(id: number, input: CreateMasterKeyBody) {
        const hashedMasterPassword = await Bun.password.hash(
            input.masterPassword
        );

        const userPassword = await db.query.users.findFirst({
            where: eq(users.id, id),
            columns: {
                password: true,
            },
        });

        if (!userPassword?.password) {
            throw new NotFoundException("User not found");
        }

        await db
            .update(users)
            .set({
                masterPassword: hashedMasterPassword,
                masterKey: input.masterKey,
                recoveryKey: input.recoveryKey,
            })
            .where(eq(users.id, id));

        return {
            status: true,
            message: "Master key created successfully",
        };
    }

    async resendOtp(body: ResendOtpBody) {
        const user = await db.query.users.findFirst({
            where: like(users.email, body.email.toLowerCase()),
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const otp = generateOtp();

        await db
            .update(users)
            .set({
                otp,
            })
            .where(like(users.email, body.email.toLowerCase()));

        const emailBody = userTemplates.resendOtp({ otp });

        sendMail({
            toAddresses: body.email,
            subject: "Passman's OTP (One time password)",
            emailBody,
        });

        return {
            status: true,
            message: "otp sent successfully",
        };
    }

    async sendResetPasswordEmail(body: SendResetPasswordEmailBody) {
        const user = await db.query.users.findFirst({
            where: like(users.email, body.email.toLowerCase()),
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const token = await createToken({
            payload: { email: user.email },
            expiresInSeconds: env.JWT_EXPIRES_IN_SECONDS,
            secret: env.JWT_SECRET,
        });

        const url = `${env.FE_URL}/reset-password/update?token=${token}`;
        const emailBody = userTemplates.resetLoginPassword({ url });

        sendMail({
            toAddresses: body.email,
            subject: "Reset login password",
            emailBody,
        });

        return {
            status: true,
            message: "reset password email sent successfully",
        };
    }

    async resetPassword(body: ResetPasswordBody) {
        const hashedPassword = await Bun.password.hash(body.password);
        const jwtTokenResult = await verifyToken<ResetPasswordJwtTokenPayload>(
            body.token,
            env.JWT_SECRET
        );

        if (!jwtTokenResult.success || !jwtTokenResult.payload) {
            throw new BadRequestException("Invalid token");
        }
        const [passwordUpdate] = await db
            .update(users)
            .set({
                password: hashedPassword,
            })
            .where(
                like(users.email, jwtTokenResult.payload.email.toLowerCase())
            );

        if (!passwordUpdate.affectedRows) {
            throw new NotFoundException("User not found");
        }

        return {
            status: true,
            message: "password updated successfully",
        };
    }

    async updateMasterPassword(userId: number, body: UpdateMasterPasswordBody) {
        const hashedMasterPassword = await Bun.password.hash(
            body.masterPassword
        );

        const [updateUser] = await db
            .update(users)
            .set({
                ...body,
                masterPassword: hashedMasterPassword,
            })
            .where(eq(users.id, userId));

        if (!updateUser.affectedRows) {
            throw new NotFoundException("User not found");
        }

        return {
            status: true,
            message: "master password updated successfully",
        };
    }
}

export default new UserService();
