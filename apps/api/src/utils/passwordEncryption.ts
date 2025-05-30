import { Buffer } from "node:buffer";
import {
    createCipheriv,
    createDecipheriv,
    randomBytes,
    scryptSync,
} from "node:crypto";

import env from "../lib/env";

export function deriveKey(password: string, salt: string): Buffer {
    return scryptSync(password, salt, env.ENC_KEY_LENGTH);
}

export function encryptPassword(
    password: string,
    storedKey: string
): { iv: string; content: string } {
    const iv = randomBytes(env.ENC_IV_LENGTH);
    const key = Buffer.from(storedKey, "hex");
    const cipher = createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(password, "utf8", "hex");
    encrypted += cipher.final("hex");

    return {
        iv: iv.toString("hex"),
        content: encrypted,
    };
}

export function decryptPassword(
    storedIv: string,
    encryptedPassword: string,
    storedKey: string
): string {
    const iv = Buffer.from(storedIv, "hex");
    const key = Buffer.from(storedKey, "hex");
    const decipher = createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedPassword, "hex", "utf-8");
    decrypted += decipher.final("utf-8");

    return decrypted;
}
