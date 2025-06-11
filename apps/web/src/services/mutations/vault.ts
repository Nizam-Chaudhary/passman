import { useMutation } from "@tanstack/react-query";
import { api } from "../api";
import type { AddVaultBodySchema } from "@passman/schema/api";
import { getToken } from "@/lib/auth";

export const useAddVault = () => {
    return useMutation({
        mutationFn: async (body: AddVaultBodySchema) => {
            const token = getToken();
            const response = await api.vaults.$post({
                header: {
                    Authorization: `Bearer ${token}`,
                },
                json: body,
            });

            if (!response.ok) throw await response.json();
            return await response.json();
        },
    });
};
