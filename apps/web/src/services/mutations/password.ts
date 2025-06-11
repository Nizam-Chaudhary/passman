import { getToken } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { api } from "../api";
import type {
    AddPasswordBody,
    IdParamsType,
    UpdatePasswordBody,
} from "@passman/schema/api";

export const useAddPassword = () => {
    return useMutation({
        mutationFn: async (body: AddPasswordBody) => {
            const token = getToken();
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
};

export const useUpdatePassword = () => {
    return useMutation({
        mutationFn: async ({
            body,
            param,
        }: {
            body: UpdatePasswordBody;
            param: IdParamsType;
        }) => {
            const token = getToken();
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
};

export const useDeletePassword = () => {
    return useMutation({
        mutationFn: async (param: IdParamsType) => {
            const token = getToken();
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
};
