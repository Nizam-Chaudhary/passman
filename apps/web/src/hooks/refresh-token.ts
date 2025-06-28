import { useNavigate } from "@tanstack/react-router";
import { useShallow } from "zustand/react/shallow";
// import { usePostApiV1AuthRefreshToken } from "@/api-client/api";
import { isTokenExpired } from "@/lib/auth";
import { useRefreshToken as useRefreshTokenMutation } from "@/services/mutations/auth";
import { useStore } from "@/stores";
import { useAuthStore } from "@/stores/auth";

export function useRefreshToken() {
  const { refreshToken, authActions } = useAuthStore(
    useShallow((state) => ({
      refreshToken: state.refreshToken,
      authActions: state.actions,
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
      authActions.logout();
      setMasterKey(null);
      setRecoveryKey("");
      navigate({ to: "/login", replace: true });
    };

    if (refreshToken == null || isTokenExpired(refreshToken)) {
      onRefreshTokenError();
      return;
    }

    return await refreshTokenMutation.mutateAsync(
      { refreshToken },
      {
        onSuccess: (response) => {
          authActions.setTokens({
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
