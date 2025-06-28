import type {
  CreateMasterKeyBody,
  RegisterUserBody,
  ResendOtpBody,
  ResetPasswordBody,
  SendResetPasswordEmailBody,
  UpdateMasterPasswordBody,
  UpdateUserDetailsBody,
  VerifyMasterPasswordBody,
  VerifyUserEmailBody,
} from "@passman/schema/api";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth";
import { api } from "../api";

export function useRegisterUser() {
  return useMutation({
    mutationFn: async (body: RegisterUserBody) => {
      const response = await api.users.register.$post({
        json: body,
      });

      if (!response.ok) throw await response.json();
      return await response.json();
    },
  });
}

export function useVerifyUserEmail() {
  return useMutation({
    mutationFn: async (body: VerifyUserEmailBody) => {
      const response = await api.users["verify-email"].$post({
        json: body,
      });

      if (!response.ok) throw await response.json();
      return await response.json();
    },
  });
}

export function useSendVerificationOtp() {
  return useMutation({
    mutationFn: async (body: ResendOtpBody) => {
      const response = await api.users["resend-otp"].$post({
        json: body,
      });

      if (!response.ok) throw await response.json();
      return await response.json();
    },
  });
}

export function useCreateMasterPassword() {
  return useMutation({
    mutationFn: async (body: CreateMasterKeyBody) => {
      const token = useAuthStore.getState().accessToken;
      const response = await api.users["master-key"].$post({
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

export function useUpdateMasterPassword() {
  return useMutation({
    mutationFn: async (body: UpdateMasterPasswordBody) => {
      const token = useAuthStore.getState().accessToken;
      const response = await api.users["update-master-password"].$patch({
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

export function useUpdateUser() {
  return useMutation({
    mutationFn: async (body: UpdateUserDetailsBody) => {
      const token = useAuthStore.getState().accessToken;
      const response = await api.users.$patch({
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

export function useVerifyMasterPassword() {
  return useMutation({
    mutationFn: async (body: VerifyMasterPasswordBody) => {
      const token = useAuthStore.getState().accessToken;
      const response = await api.users["verify-master-password"].$post({
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

export function useSendResetPasswordMail() {
  return useMutation({
    mutationFn: async (body: SendResetPasswordEmailBody) => {
      const response = await api.users["reset-password-email"].$post({
        json: body,
      });

      if (!response.ok) throw await response.json();
      return await response.json();
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (body: ResetPasswordBody) => {
      const response = await api.users["reset-password"].$post({
        json: body,
      });

      if (!response.ok) throw await response.json();
      return await response.json();
    },
  });
}
