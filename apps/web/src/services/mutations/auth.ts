import { useMutation } from "@tanstack/react-query";
import type { LoginUserBody } from "@passman/schema/api/auth";
import { api } from "../api";

export const useLoginUser = () => {
    return useMutation({
        mutationFn: async (body: LoginUserBody) => {
            const response = await api.auth.login.$post({
                json: body,
            });

            if (!response.ok) throw await response.json();
            return await response.json();
        },
    });
};
