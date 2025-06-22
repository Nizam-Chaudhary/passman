import type { Prettify } from "@/vite-env";
import type { JwtUserData } from "@passman/schema/api";
import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface AuthStates {
    isLoggedIn: boolean;
    isAuthenticated: boolean;
    isEmailVerified: boolean;
    isMasterPasswordCreated: boolean;
    user: JwtUserData | null;
    accessToken: string | null;
    refreshToken: string | null;
    userEmail: string | null;
}

interface AuthActions {
    actions: {
        login: (data: {
            user: JwtUserData;
            isEmailVerified: boolean;
            accessToken: string;
            refreshToken: string;
        }) => void;
        setIsEmailVerified: (isEmailVerified: boolean) => void;
        setUserEmail: (userEmail: string) => void;
        setMasterPasswordCreated: (isMasterPasswordCreated: boolean) => void;
        authenticate: () => void;
        logout: () => void;
        setTokens: (data: {
            accessToken: string;
            refreshToken: string;
        }) => void;
    };
}

const initialState: AuthStates = {
    isLoggedIn: false,
    isAuthenticated: false,
    isEmailVerified: false,
    isMasterPasswordCreated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    userEmail: null,
};

export type AuthStore = Prettify<AuthStates & AuthActions>;

export const useAuthStore = create<AuthStore>()(
    devtools(
        subscribeWithSelector(
            persist(
                immer((set) => ({
                    ...initialState,
                    actions: {
                        login: (data) => {
                            set((state) => {
                                state.isLoggedIn = true;
                                state.isEmailVerified = true;
                                state.isMasterPasswordCreated =
                                    !!data.user.masterKeyCreated;
                                state.user = data.user;
                                state.accessToken = data.accessToken;
                                state.refreshToken = data.refreshToken;
                                state.userEmail = data.user.email;
                            });
                        },
                        setIsEmailVerified: (isEmailVerified) => {
                            set((state) => {
                                state.isEmailVerified = isEmailVerified;
                            });
                        },
                        setUserEmail: (email) => {
                            set((state) => {
                                state.userEmail = email;
                            });
                        },
                        setMasterPasswordCreated: (isMasterPasswordCreated) => {
                            set((state) => {
                                state.isMasterPasswordCreated =
                                    isMasterPasswordCreated;
                            });
                        },
                        authenticate: () => {
                            set((state) => {
                                state.isAuthenticated = true;
                            });
                        },
                        logout: () => {
                            set((state) => {
                                state.isLoggedIn = false;
                                state.isAuthenticated = false;
                                state.isEmailVerified = false;
                                state.isMasterPasswordCreated = false;
                                state.user = null;
                                state.accessToken = null;
                                state.refreshToken = null;
                            });
                        },
                        setTokens: (data) => {
                            set((state) => {
                                state.accessToken = data.accessToken;
                                state.refreshToken = data.refreshToken;
                            });
                        },
                    },
                })),
                {
                    name: "passman-auth",
                    partialize: (state) =>
                        Object.fromEntries(
                            Object.entries(state).filter(
                                ([key]) =>
                                    !["isAuthenticated", "actions"].includes(
                                        key
                                    )
                            )
                        ),
                }
            )
        )
    )
);
