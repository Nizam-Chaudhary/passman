import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export const useGetVaults = () => {
    return useQuery({
        queryKey: ["vaults"],
        queryFn: async () => {
            const token = useAuthStore.getState().accessToken;
            const response = await api.vaults.$get({
                header: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw await response.json();
            return await response.json();
        },
    });
};
