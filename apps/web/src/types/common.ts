import { z } from "zod";

export interface ApiResponse {
    status: "success" | "fail" | "error";
    message: string;
}

export interface UpdateResourcePayload<T> {
    id: string;
    data: T;
}

export const ecryptedValueSchema = z.object({
    iv: z.string().min(1, "iv is required"),
    encrypted: z.string().min(1, "key is required"),
});

export type EncryptedValue = z.infer<typeof ecryptedValueSchema>;
