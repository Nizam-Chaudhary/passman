import type { JwtUserData, LoginUserBody, RefreshTokenBody } from "@passman/schema/api";
import { eq, like } from "drizzle-orm";
import * as jwt from "hono/jwt";
import { db } from "../../db/index";
import { users } from "../../db/schema";
import { env } from "../../lib/env";
import { UnauthorizedException } from "../../lib/responseExceptions";
import { createToken } from "../../utils/tokenHelper";

class AuthService {
  async loginUser(input: LoginUserBody) {
    const userData = await db.query.users.findFirst({
      columns: {
        id: true,
        userName: true,
        email: true,
        password: true,
        masterKey: true,
        isVerified: true,
      },
      where: like(users.email, input.email.toLowerCase()),
    });

    if (!userData) {
      throw new UnauthorizedException("Email not registered. Please register first!");
    }

    if (!userData.isVerified) {
      throw new UnauthorizedException("Email not verified. Please verify first!");
    }

    const isMatch = userData && (await Bun.password.verify(input.password, userData.password));

    if (!userData || !isMatch) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const tokenPayload = {
      id: userData.id,
      email: userData.email,
      userName: userData.userName,
      masterKeyCreated: !!userData.masterKey,
    };
    const [token, refreshToken] = await Promise.all([
      await createToken({
        payload: tokenPayload,
        expiresInSeconds: env.JWT_EXPIRES_IN_SECONDS,
        secret: env.JWT_SECRET,
      }),
      await createToken({
        payload: tokenPayload,
        expiresInSeconds: env.JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS,
        secret: env.JWT_SECRET,
      }),
    ]);

    return {
      status: true,
      message: "User logged in successfully",
      data: {
        token,
        refreshToken,
        isVerified: userData.isVerified,
        masterKey: userData.masterKey,
      },
    };
  }

  async refreshToken(body: RefreshTokenBody) {
    const tokenData = (await jwt.verify(
      body.refreshToken,
      env.JWT_SECRET,
    )) as unknown as JwtUserData;

    if (!tokenData) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const userData = await db.query.users.findFirst({
      columns: {
        id: true,
        userName: true,
        email: true,
        masterKey: true,
      },
      where: eq(users.id, tokenData.id),
    });

    if (!userData) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const tokenPayload = {
      id: userData.id,
      email: userData.email,
      userName: userData.userName,
      masterKeyCreated: !!userData.masterKey,
    };
    const [token, refreshToken] = await Promise.all([
      await createToken({
        payload: tokenPayload,
        expiresInSeconds: env.JWT_EXPIRES_IN_SECONDS,
        secret: env.JWT_SECRET,
      }),
      await createToken({
        payload: tokenPayload,
        expiresInSeconds: env.JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS,
        secret: env.JWT_SECRET,
      }),
    ]);

    return {
      status: true,
      message: "Token refreshed successfully",
      data: {
        token,
        refreshToken,
      },
    };
  }
}

export default new AuthService();
