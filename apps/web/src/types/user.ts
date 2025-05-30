import type { FileDetails } from "./file";

export interface GetUserResponseSchema {
    status: "success" | "fail" | "error";
    data: {
        id: number;
        userName: string;
        email: string;
        masterKey: {
            iv: string;
            encrypted: string;
            salt: string;
        };
        recoveryKey: {
            iv: string;
            encrypted: string;
            salt: string;
        };
        createdAt: Date;
        updatedAt: Date;
        file?: FileDetails;
    };
}

export interface JwtUserData {
    id: number;
    userName: string;
    email: string;
    masterKeyCreated: boolean;
    exp: number;
    iat: number;
}

export interface UpdateUserBody {
    userName?: string;
    fileId?: number;
}
