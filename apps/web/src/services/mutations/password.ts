import type { AddPasswordBody, IdParamsType, UpdatePasswordBody } from "@passman/schema/api";

import { useMutation } from "@tanstack/react-query";

import { useAuthStore } from "@/stores/auth";

import { api } from "../api";

export function useAddPassword() {
  return useMutation({
    mutationFn: async (body: AddPasswordBody) => {
      const token = useAuthStore.getState().accessToken;
      const response = await api.passwords.$post({
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

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async ({ body, param }: { body: UpdatePasswordBody; param: IdParamsType }) => {
      const token = useAuthStore.getState().accessToken;
      const response = await api.passwords[":id"].$patch({
        header: {
          Authorization: `Bearer ${token}`,
        },
        json: body,
        param: {
          id: param.id.toString(),
        },
      });

      if (!response.ok) throw await response.json();
      return await response.json();
    },
  });
}

export function useDeletePassword() {
  return useMutation({
    mutationFn: async (param: IdParamsType) => {
      const token = useAuthStore.getState().accessToken;
      const response = await api.passwords[":id"].$delete({
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
  });
}

export function useDeleteMultiplePasswords() {
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const token = useAuthStore.getState().accessToken;
      const response = await api.passwords.bulk.$delete({
        header: {
          Authorization: `Bearer ${token}`,
        },
        json: { ids },
      });

      if (!response.ok) throw await response.json();
      return await response.json();
    },
  });
}
