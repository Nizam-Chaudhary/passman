import type { GetPasswordsQueryOptions, IdParamsType } from "@passman/schema/api";
import { useQuery } from "@tanstack/react-query";
import { decrypt } from "@/lib/encryption.helper";
import { useAuthStore } from "@/stores/auth";
import { api } from "../api";

export function useGetPasswordListForVault(query: GetPasswordsQueryOptions) {
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
}

export function useGetPasswordById(options: { param: IdParamsType; masterKey: CryptoKey }) {
  return useQuery({
    queryKey: ["passwords", { options }],
    queryFn: async () => {
      const token = useAuthStore.getState().accessToken;
      const response = await api.passwords[":id"].$get({
        header: {
          Authorization: `Bearer ${token}`,
        },
        param: {
          id: options.param.id.toString(),
        },
      });

      if (!response.ok) throw await response.json();
      const json = await response.json();

      const decryptedPassword = await decrypt(json.data.password, options.masterKey);
      return { data: json.data, decryptedPassword };
    },
    enabled: !!options.param.id,
  });
}
