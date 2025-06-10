import { useMutation } from "@tanstack/react-query";
import type {
    CreateMasterKeyBody,
    RegisterUserBody,
    ResendOtpBody,
    ResetPasswordBody,
    SendResetPasswordEmailBody,
    VerifyMasterPasswordBody,
    VerifyUserEmailBody,
} from "@passman/schema/api";
import { api } from "../api";
import { getToken } from "@/lib/auth";

export const useRegisterUser = () => {
    return useMutation({
        mutationFn: async (body: RegisterUserBody) => {
            const response = await api.users["register"].$post({
                json: body,
            });

            if (!response.ok) throw await response.json();
            return await response.json();
        },
    });
};

export const useVerifyUserEmail = () => {
    return useMutation({
        mutationFn: async (body: VerifyUserEmailBody) => {
            const response = await api.users["verify-email"].$post({
                json: body,
            });

            if (!response.ok) throw await response.json();
            return await response.json();
        },
    });
};

export const useSendVerificationOtp = () => {
    return useMutation({
        mutationFn: async (body: ResendOtpBody) => {
            const response = await api.users["resend-otp"].$post({
                json: body,
            });

            if (!response.ok) throw await response.json();
            return await response.json();
        },
    });
};

export const useCreateMasterPassword = () => {
    return useMutation({
        mutationFn: async (body: CreateMasterKeyBody) => {
            const token = getToken();
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
};

export const useVerifyMasterPassword = () => {
    return useMutation({
        mutationFn: async (body: VerifyMasterPasswordBody) => {
            const token = getToken();
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
};

export const useSendResetPasswordMail = () => {
    return useMutation({
        mutationFn: async (body: SendResetPasswordEmailBody) => {
            const response = await api.users["reset-password-email"].$post({
                json: body,
            });

            if (!response.ok) throw await response.json();
            return await response.json();
        },
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: async (body: ResetPasswordBody) => {
            const response = await api.users["reset-password"].$post({
                json: body,
            });

            if (!response.ok) throw await response.json();
            return await response.json();
        },
    });
};
