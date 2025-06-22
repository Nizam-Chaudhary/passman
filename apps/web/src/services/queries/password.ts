import { useAuthStore } from "@/stores/auth";
import type {
    GetPasswordsQueryOptions,
    IdParamsType,
} from "@passman/schema/api";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export const useGetPasswordListForVault = (query: GetPasswordsQueryOptions) => {
    return useQuery({
        queryKey: ["passwords", query],
        queryFn: async () => {
            const token = useAuthStore.getState().accessToken;
            const response = await api.passwords.$get({
                header: {
                    Authorization: `Bearer ${token}`,
                },
                query: {
                    vaultId: query.vaultId.toString(),
                    search: query.search,
                },
            });

            if (!response.ok) throw await response.json();
            return await response.json();
        },
        enabled: !!query?.vaultId,
    });
};

export const useGetPasswordById = (param: IdParamsType) => {
    return useQuery({
        queryKey: ["passwords", param],
        queryFn: async () => {
            const token = useAuthStore.getState().accessToken;
            const response = await api.passwords[":id"].$get({
                header: {
                    Authorization: `Bearer ${token}`,
                },
                param: {
                    id: param.id.toString(),
                },
            });

            if (!response.ok) throw await response.json();
            return await response.json();
        },
        enabled: !!param.id,
    });
};
