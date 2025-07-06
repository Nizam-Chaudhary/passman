import type { LoginUserBody, RefreshTokenBody } from "@passman/schema/api/auth";

import { useMutation } from "@tanstack/react-query";

import { api } from "../api";

export function useLoginUser() {
  return useMutation({
    mutationFn: async (body: LoginUserBody) => {
      const response = await api.auth.login.$post({
        json: body,
      });

      if (!response.ok) throw await response.json();
      return await response.json();
    },
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: async (body: RefreshTokenBody) => {
      const response = await api.auth["refresh-token"].$post({
        json: body,
      });

      if (!response.ok) throw await response.json();
      return await response.json();
    },
  });
}
