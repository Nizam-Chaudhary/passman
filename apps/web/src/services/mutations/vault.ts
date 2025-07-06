import type { AddVaultBodySchema } from "@passman/schema/api";

import { useMutation } from "@tanstack/react-query";

import { useAuthStore } from "@/stores/auth";

import { api } from "../api";

export function useAddVault() {
  return useMutation({
    mutationFn: async (body: AddVaultBodySchema) => {
      const token = useAuthStore.getState().accessToken;
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
}
