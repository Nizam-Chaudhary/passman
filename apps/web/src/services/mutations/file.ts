import { getToken } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { api } from "../api";
import type { UploadFileBody } from "@passman/schema/api";

export const useUploadFile = () => {
    return useMutation({
        mutationFn: async (form: UploadFileBody) => {
            const token = getToken();
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
