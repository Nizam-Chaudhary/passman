import { useAuthStore } from "@/stores/auth";
import type { UploadFileBody } from "@passman/schema/api";
import { useMutation } from "@tanstack/react-query";
import { api } from "../api";

export const useUploadFile = () => {
    return useMutation({
        mutationFn: async (form: UploadFileBody) => {
            const token = useAuthStore.getState().accessToken;
            const response = await api.files["upload"].$post({
                header: {
                    Authorization: `Bearer ${token}`,
                },
                form,
            });

            if (!response.ok) {
                throw new Error("Failed to upload file");
            }

            return await response.json();
        },
    });
};
