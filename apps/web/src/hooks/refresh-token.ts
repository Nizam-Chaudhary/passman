// import { usePostApiV1AuthRefreshToken } from "@/api-client/api";
import {
    getRefreshToken,
    isTokenExpired,
    removeRefreshToken,
    removeToken,
    setRefreshToken,
    setToken,
} from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { useStore } from "@/store/store";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { useRefreshToken as useRefreshTokenMutation } from "@/services/mutations/auth";

export function useRefreshToken() {
    const {
        setIsAuthenticated,
        setIsEmailVerified,
        setIsMasterPasswordSet,
        setUserKey,
        setMasterkey,
        setRecoveryKey,
    } = useStore(
        useShallow((state) => ({
            setOpenAddPasswordDialog: state.setOpenAddPasswordDialog,
            setIsAuthenticated: state.setIsAuthenticated,
            setIsEmailVerified: state.setIsEmailVerified,
            setIsMasterPasswordSet: state.setIsMasterPasswordSet,
            setUserKey: state.setUserKey,
            setMasterkey: state.setMasterkey,
            setRecoveryKey: state.setRecoveryKey,
        }))
    );

    const navigate = useNavigate();
    const refreshTokenMutation = useRefreshTokenMutation();

    const mutate = async () => {
        const onRefreshTokenError = () => {
            removeToken();
            removeRefreshToken();
            setIsAuthenticated(false);
            setIsEmailVerified(null);
            setIsMasterPasswordSet(null);
            setUserKey(null);
            setMasterkey(null);
            setRecoveryKey("");
            navigate(ROUTES.LOGIN, { replace: true });
        };

        const token = getRefreshToken();
        if (token == null || isTokenExpired(token)) {
            onRefreshTokenError();
            return;
        }

        return await refreshTokenMutation.mutateAsync(
            { refreshToken: token },
            {
                onSuccess: (response) => {
                    setToken(response.data.token);
                    setRefreshToken(response.data.refreshToken);
                },
                onError: onRefreshTokenError,
            }
        );
    };

    return { mutate };
}
