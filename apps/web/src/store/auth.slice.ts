import type { Store } from "@/types/store";
import type { StateCreator } from "zustand";

interface AuthStates {
    isAuthenticated: boolean | null;
    isEmailVerified: boolean | null;
    isMasterPasswordSet: boolean | null;
    userKey?: CryptoKey | null;
    masterKey?: CryptoKey | null;
    openRecoveryKeyDialog: boolean;
    recoveryKey: string;
    masterKeyForUpdate: string | null;
    otpTimer: number;
}

interface AuthActions {
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setIsEmailVerified: (isVerified: boolean | null) => void;
    setIsMasterPasswordSet: (isSet: boolean | null) => void;
    setUserKey: (key: CryptoKey | null) => void;
    setMasterkey: (key: CryptoKey | null) => void;
    setOpenRecoveryKeyDialog: (open: boolean) => void;
    setRecoveryKey: (key: string) => void;
    setMasterKeyForUpdate: (key: string | null) => void;
    decreateOtpTime: () => void;
    setOtpTimer: (timer: number) => void;
}

const initialState: AuthStates = {
    isAuthenticated: null,
    isEmailVerified: null,
    isMasterPasswordSet: false,
    openRecoveryKeyDialog: false,
    recoveryKey: "",
    masterKeyForUpdate: null,
    otpTimer: 0,
};

export type AuthSlice = AuthStates & AuthActions;

export const createAuthSlice: StateCreator<
    Store,
    [["zustand/immer", never]],
    [],
    AuthSlice
> = (set) => ({
    ...initialState,
    setIsAuthenticated: (isAuthenticated) =>
        set((state) => {
            state.isAuthenticated = isAuthenticated;
        }),
    setUserKey: (key) =>
        set((state) => {
            state.userKey = key;
        }),
    setIsEmailVerified: (isVerified) =>
        set((state) => {
            state.isEmailVerified = isVerified;
        }),
    setIsMasterPasswordSet: (isSet) =>
        set((state) => {
            state.isMasterPasswordSet = isSet;
        }),
    setMasterkey: (key) =>
        set((state) => {
            state.masterKey = key;
        }),
    setOpenRecoveryKeyDialog: (open) =>
        set((state) => {
            state.openRecoveryKeyDialog = open;
        }),
    setRecoveryKey: (key) =>
        set((state) => {
            state.recoveryKey = key;
        }),
    setMasterKeyForUpdate: (key) =>
        set((state) => {
            state.masterKeyForUpdate = key;
        }),
    decreateOtpTime: () =>
        set((state) => {
            if (state.otpTimer > 0) {
                state.otpTimer--;
            }
        }),
    setOtpTimer: (timer) =>
        set((state) => {
            state.otpTimer = timer;
        }),
});
