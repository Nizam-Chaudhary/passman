import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth";
import { api } from "../api";

export function useGetUserDetails() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const token = useAuthStore.getState().accessToken;
      const response = await api.users.$get({
        header: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw await response.json();
      return await response.json();
    },
  });
}
