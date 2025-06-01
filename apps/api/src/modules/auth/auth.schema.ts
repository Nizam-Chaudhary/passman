import { z } from "zod/v4";

// Login
export const loginUserBodySchema = z
    .object({
        email: z
            .email({ error: "Invalid email format" })
            .describe("User account email"),
        password: z.string().describe("User account password"),
    })
    .describe("Schema for user signin data");

export type LoginUserBody = z.infer<typeof loginUserBodySchema>;

// Refresh token
export const refreshTokenBodySchema = z
    .object({
        refreshToken: z.string().describe("JWT refresh token"),
    })
    .describe("Schema for refresh token request");

export type RefreshTokenBody = z.infer<typeof refreshTokenBodySchema>;

export interface JwtUserData {
    id: number;
    userName: string;
    email: string;
    masterKeyCreated: boolean;
    exp: number;
    iat: number;
}
