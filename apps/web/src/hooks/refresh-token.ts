// import { usePostApiV1AuthRefreshToken } from "@/api-client/api";
import { isTokenExpired } from "@/lib/auth";
import { useRefreshToken as useRefreshTokenMutation } from "@/services/mutations/auth";
import { useStore } from "@/stores";
import { useAuthStore } from "@/stores/auth";
import { useNavigate } from "@tanstack/react-router";
import { useShallow } from "zustand/react/shallow";

export function useRefreshToken() {
    const { logoutStorage, refreshToken, setTokens } = useAuthStore(
        useShallow((state) => ({
            logoutStorage: state.logout,
            refreshToken: state.refreshToken,
            setTokens: state.setTokens,
        }))
    );
    const { setMasterKey, setRecoveryKey } = useStore(
        useShallow((state) => ({
            setOpenAddPasswordDialog: state.setOpenAddPasswordDialog,
            setMasterKey: state.setMasterKey,
            setRecoveryKey: state.setRecoveryKey,
        }))
    );

    const navigate = useNavigate();
    const refreshTokenMutation = useRefreshTokenMutation();

    const mutate = async () => {
        const onRefreshTokenError = () => {
            logoutStorage();
            setMasterKey(null);
            setRecoveryKey("");
            navigate({ to: "/login", replace: true });
        };

        if (refreshToken == null || isTokenExpired(refreshToken)) {
            onRefreshTokenError();
            return;
        }

        return await refreshTokenMutation.mutateAsync(
            { refreshToken: refreshToken },
            {
                onSuccess: (response) => {
                    setTokens({
                        accessToken: response.data.token,
                        refreshToken: response.data.refreshToken,
                    });
                },
                onError: onRefreshTokenError,
            }
        );
    };

    return { mutate };
}
