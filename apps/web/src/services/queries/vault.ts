import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/stores/auth";

import { api } from "../api";

export function useGetVaults() {
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
}
