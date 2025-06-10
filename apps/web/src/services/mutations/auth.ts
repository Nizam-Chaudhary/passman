import { useMutation } from "@tanstack/react-query";
import type { LoginUserBody, RefreshTokenBody } from "@passman/schema/api/auth";
import { api } from "../api";
import { getRefreshToken } from "@/lib/auth";

export const useLoginUser = () => {
    return useMutation({
        mutationFn: async (body: LoginUserBody) => {
            const response = await api.auth["login"].$post({
                json: body,
            });

            if (!response.ok) throw await response.json();
            return await response.json();
        },
    });
};

export const useRefreshToken = () => {
    return useMutation({
        mutationFn: async (body: RefreshTokenBody) => {
            const response = await api.auth["refresh-token"].$post({
                json: body,
            });

            if (!response.ok) throw await response.json();
            return await response.json();
        },
    });
};
