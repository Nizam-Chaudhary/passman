import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { getToken } from "@/lib/auth";

export const useGetUserDetails = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const token = getToken();
            const response = await api.users.$get({
                header: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw await response.json();
            return await response.json();
        },
    });
};
