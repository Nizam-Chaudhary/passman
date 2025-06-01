import { verify, sign, decode } from "hono/jwt";

interface CreateToken<T> {
    payload: T;
    expiresInSeconds: number;
    secret: string;
}

interface VerifyTokenResult<T> {
    success: boolean;
    payload?: T;
    error?: {
        code:
            | "INVALID_TOKEN"
            | "TOKEN_EXPIRED"
            | "INVALID_SIGNATURE"
            | "MALFORMED_TOKEN";
        message: string;
    };
}

interface DecodeTokenResult<T> {
    success: boolean;
    payload?: T;
    error?: {
        code: "MALFORMED_TOKEN" | "DECODE_ERROR";
        message: string;
    };
}

export const createToken = async <T extends Record<string, any>>(
    options: CreateToken<T>
) => {
    const { payload, expiresInSeconds, secret } = options;
    const expirationTime = calculateExpirationTime(expiresInSeconds);
    const token = await sign({ ...payload, exp: expirationTime }, secret);
    return token;
};

export const verifyToken = async <T = Record<string, any>>(
    token: string,
    secret: string
): Promise<VerifyTokenResult<T>> => {
    try {
        const payload = await verify(token, secret);
        return {
            success: true,
            payload: payload as T,
        };
    } catch (error: any) {
        const errorMessage = error?.message || "Unknown verification error";

        // Check for specific error types
        if (errorMessage.includes("expired")) {
            return {
                success: false,
                error: {
                    code: "TOKEN_EXPIRED",
                    message: "Token has expired",
                },
            };
        }

        if (errorMessage.includes("signature")) {
            return {
                success: false,
                error: {
                    code: "INVALID_SIGNATURE",
                    message: "Invalid token signature",
                },
            };
        }

        if (
            errorMessage.includes("malformed") ||
            errorMessage.includes("invalid")
        ) {
            return {
                success: false,
                error: {
                    code: "MALFORMED_TOKEN",
                    message: "Token is malformed or invalid",
                },
            };
        }

        return {
            success: false,
            error: {
                code: "INVALID_TOKEN",
                message: errorMessage,
            },
        };
    }
};

export const decodeToken = <T = Record<string, any>>(
    token: string
): DecodeTokenResult<T> => {
    try {
        const payload = decode(token);
        return {
            success: true,
            payload: payload.payload as T,
        };
    } catch (error: any) {
        const errorMessage = error?.message || "Unknown decode error";

        if (errorMessage.includes("malformed")) {
            return {
                success: false,
                error: {
                    code: "MALFORMED_TOKEN",
                    message: "Token is malformed",
                },
            };
        }

        return {
            success: false,
            error: {
                code: "DECODE_ERROR",
                message: errorMessage,
            },
        };
    }
};

const calculateExpirationTime = (expiresInSeconds: number) => {
    return Math.floor(Date.now() / 1000) + expiresInSeconds;
};

export type { CreateToken, VerifyTokenResult, DecodeTokenResult };
