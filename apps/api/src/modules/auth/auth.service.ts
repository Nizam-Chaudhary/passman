import { compare, compareSync, hash, hashSync } from "bcrypt";
import { eq, ilike } from "drizzle-orm";
import type {
    CreateMasterKeyBody,
    SignInUserInput,
    SignUpUserInput,
    UpdateMasterPasswordBody,
    VerifyMasterPasswordBody,
    VerifyUserEmailBody,
} from "./auth.schema";

import moment from "moment";

import { db } from "../../db/index";
import { users, vaults } from "../../db/schema/schema";
import AppError from "../../lib/appError";
import env from "../../lib/env";
import { sendMail } from "../../lib/mailer";
import * as userTemplates from "../../templates/user";
import { generateOtp } from "../../utils/generator";

class AuthService {
    async signUpUser(input: SignUpUserInput) {
        const alreadyRegistered = await db.query.users.findFirst({
            columns: {
                id: true,
            },
            where: ilike(users.email, input.email),
        });

        if (alreadyRegistered) {
            const newLocal = "Email already registered";
            throw new AppError("EMAIL_ALREADY_REGISTERED", newLocal, 400);
        }

        const hashedPassword = hashSync(input.password, env.SALT_ROUNDS);

        const otp = generateOtp();

        return await db.transaction(async (tx) => {
            const user = await tx
                .insert(users)
                .values({
                    email: input.email,
                    userName: input.userName,
                    password: hashedPassword,
                    otp,
                    isVerified: false,
                })
                .returning();

            await tx.insert(vaults).values({
                name: "Default",
                userId: user[0].id,
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
                status: "success",
                message: "User signed up successfully",
                data: user[0],
            };
        });
    }

    async signInUser(input: SignInUserInput) {
        const userData = await db.query.users.findFirst({
            columns: {
                id: true,
                userName: true,
                email: true,
                password: true,
                masterKey: true,
                isVerified: true,
            },
            where: ilike(users.email, input.email),
        });

        if (!userData) {
            throw new AppError(
                "USER_NOT_REGISTERED",
                "Email not registered. Please register first!",
                401,
                true
            );
        }

        if (!userData.isVerified) {
            throw new AppError(
                "EMAIL_NOT_VERIFIED",
                "Email not verified. Please verify first!",
                401,
                true
            );
        }

        const isMatch =
            userData && (await compare(input.password, userData.password));

        if (!userData || !isMatch) {
            throw new AppError(
                "INVALID_CREDENTIALS",
                "Invalid email or password",
                401,
                true
            );
        }

        return {
            id: userData.id,
            email: userData.email,
            userName: userData.userName,
            masterKey: userData.masterKey,
            isVerified: userData.isVerified,
        };
    }

    async refreshToken(id: number) {
        const userData = await db.query.users.findFirst({
            columns: {
                id: true,
                userName: true,
                email: true,
                masterKey: true,
            },
            where: eq(users.id, id),
        });

        if (!userData) {
            throw new AppError("UNAUTORIZED", "Refresh token is invalid", 401);
        }

        return {
            id: userData.id,
            email: userData.email,
            userName: userData.userName,
            masterKeyCreated: !!userData.masterKey,
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
            where: ilike(users.email, input.email),
        });

        if (!userData) {
            throw new AppError(
                "USER_NOT_REGISTERED",
                "Email not registered. Please register first!",
                400
            );
        }

        if (
            moment(userData.updatedAt).isBefore(moment().subtract(5, "minutes"))
        ) {
            throw new AppError("OTP_EXPIRED", "Entered otp is expired", 400);
        }
        if (input.otp !== userData.otp) {
            throw new AppError("INVALID_OTP", "Invalid OTP", 400);
        }

        await db
            .update(users)
            .set({
                isVerified: true,
            })
            .where(eq(users.id, userData.id));

        return {
            status: "success",
            message: "Email verified successfully",
        };
    }

    async createMasterKey(id: number, input: CreateMasterKeyBody) {
        const hashedMasterPassword = await hash(
            input.masterPassword,
            env.SALT_ROUNDS
        );

        const userPassword = await db.query.users.findFirst({
            where: eq(users.id, id),
            columns: {
                password: true,
            },
        });

        if (!userPassword?.password) {
            throw new AppError("USER_NOT_FOUND", "user not found", 400);
        }

        // if (compareSync(input.masterPassword, userPassword.password)) {
        //   throw new AppError(
        //     "MASTER_PASSWORD_AND_PASSWORD_MATCH",
        //     "Master password and user password cannot be same",
        //     400
        //   );
        // }

        await db
            .update(users)
            .set({
                masterPassword: hashedMasterPassword,
                masterKey: input.masterKey,
                recoveryKey: input.recoveryKey,
            })
            .where(eq(users.id, id));

        return {
            status: "success",
            message: "Master key created successfully",
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
            throw new AppError(
                "MASTER_PASSWORD_NOT_EXISTS",
                "Master password not created yet",
                400
            );
        }

        const isMasterPasswordValid = compareSync(
            input.masterPassword,
            user.masterPassword
        );

        if (!isMasterPasswordValid) {
            throw new AppError(
                "INCORRECT_MASTER_PASSWORD",
                "Incorrect master password",
                400
            );
        }

        return {
            status: "success",
            message: "Master password verified successfully",
            data: {
                masterKey: user.masterKey,
            },
        };
    }

    async resendOtp(email: string) {
        const user = await db.query.users.findFirst({
            where: ilike(users.email, email),
        });

        if (!user) {
            throw new AppError(
                "USER_NOT_FOUND",
                "No user found for email",
                400
            );
        }

        if (moment(user.updatedAt).isAfter(moment().subtract(2, "minutes"))) {
            throw new AppError(
                "OTP_RESEND_LIMIT_REACHED",
                "OTP resend limit reached",
                400
            );
        }

        const otp = generateOtp();

        const updateOtp = await db
            .update(users)
            .set({
                otp,
            })
            .where(ilike(users.email, email));

        if (!updateOtp.rowCount || updateOtp.rowCount <= 0) {
            throw new AppError(
                "UNABLE_TO_UPDATE_OTP",
                "Error sending otp",
                400
            );
        }

        const emailBody = userTemplates.resendOtp({ otp });

        sendMail({
            toAddresses: email,
            subject: "Passman's OTP (One time password)",
            emailBody,
        });

        return {
            status: "success",
            message: "otp sent successfully",
        };
    }

    async sendResetPasswordEmail(email: string, token: string) {
        const user = await db.query.users.findFirst({
            where: ilike(users.email, email),
        });

        if (!user) {
            throw new AppError("USER_NOT_FOUND", "Email not registered", 400);
        }

        if (moment(user.updatedAt).isAfter(moment().subtract(2, "minutes"))) {
            throw new AppError(
                "EMAIL_SEND_LIMIT_REACHED",
                "Email sending limit reached",
                400
            );
        }

        const url = `${env.FE_URL}/reset-password/update?token=${token}`;
        const emailBody = userTemplates.resetLoginPassword({ url });

        sendMail({
            toAddresses: email,
            subject: "Reset login password",
            emailBody,
        });

        return {
            status: "success",
            message: "reset password email sent successfully",
        };
    }

    async resetPassword(email: string, password: string) {
        const hashedPassword = hashSync(password, env.SALT_ROUNDS);

        const passwordUpdate = await db
            .update(users)
            .set({
                password: hashedPassword,
            })
            .where(ilike(users.email, email));

        if (!passwordUpdate.rowCount || passwordUpdate.rowCount <= 0) {
            throw new AppError("USER_NOT_FOUND", "Email not registered", 400);
        }

        return {
            status: "success",
            message: "password updated successfully",
        };
    }

    async updateMasterPassword(userId: number, body: UpdateMasterPasswordBody) {
        const hashedMasterPassword = await hash(
            body.masterPassword,
            env.SALT_ROUNDS
        );

        const updateUser = await db
            .update(users)
            .set({
                ...body,
                masterPassword: hashedMasterPassword,
            })
            .where(eq(users.id, userId));

        if (!updateUser.rowCount || updateUser.rowCount <= 0) {
            throw new AppError("USER_NOT_FOUND", "User not found", 400);
        }

        return {
            status: "success",
            message: "master password updated successfully",
        };
    }
}

export default new AuthService();
