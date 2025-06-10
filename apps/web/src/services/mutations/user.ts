import { useMutation } from "@tanstack/react-query";
import type { RegisterUserBody, ResendOtpBody } from "@passman/schema/api/user";
import { api } from "../api";
import type { VerifyUserEmailBody } from "../../../../api/src/modules/user/user.schema";

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
