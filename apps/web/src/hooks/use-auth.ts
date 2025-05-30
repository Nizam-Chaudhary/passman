import { checkAuthStatus, getRefreshToken } from "@/lib/auth";
import { useStore } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useRefreshToken } from "./refresh-token";

function useAuth() {
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated, userData, setUserData, setIsAuthenticated } =
        useStore(
            useShallow((state) => ({
                isAuthenticated: state.isAuthenticated,
                setUserData: state.setUserData,
                setIsAuthenticated: state.setIsAuthenticated,
                userData: state.userData,
            }))
        );

    const refreshTokenMutationRef = useRef(useRefreshToken());
    useEffect(() => {
        let isMounted = true;

        const initializeAuth = async () => {
            try {
                let authStatus = checkAuthStatus();
                if (!authStatus.isAuthenticated && getRefreshToken()) {
                    if (!isMounted) return;
                    await refreshTokenMutationRef.current.mutate();
                    authStatus = checkAuthStatus();
                }

                if (!isMounted) return;
                setIsAuthenticated(authStatus.isAuthenticated);
                setUserData(authStatus.userData);
            } catch {
                if (!isMounted) return;
                // Handle refresh token error
                setIsAuthenticated(false);
                setUserData(null);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { isAuthenticated, userData, isLoading };
}

export default useAuth;
