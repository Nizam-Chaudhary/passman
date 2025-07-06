import type { StateCreator } from "zustand";

import type { Store } from "@/stores";

interface MasterPasswordStates {
  masterKey: CryptoKey | null;
  recoveryKey: string | null;
  openRecoveryKeyDialog: boolean;
  masterKeyForUpdate: string | null;
}

interface MasterPasswordActions {
  setMasterKey: (masterKey: CryptoKey | null) => void;
  setRecoveryKey: (recoveryKey: string) => void;
  setOpenRecoveryKeyDialog: (openRecoveryKeyDialog: boolean) => void;
  setMasterKeyForUpdate: (masterKeyForUpdate: string | null) => void;
}

const initialState: MasterPasswordStates = {
  masterKey: null,
  recoveryKey: null,
  openRecoveryKeyDialog: false,
  masterKeyForUpdate: null,
};

export type MasterPasswordSlice = MasterPasswordStates & MasterPasswordActions;

export const createMasterPasswordSlice: StateCreator<
  Store,
  [["zustand/immer", never]],
  [],
  MasterPasswordSlice
> = (set) => ({
  ...initialState,
  setMasterKey: (masterKey) =>
    set((state) => {
      state.masterKey = masterKey;
    }),
  setRecoveryKey: (recoveryKey) =>
    set((state) => {
      state.recoveryKey = recoveryKey;
    }),
  setOpenRecoveryKeyDialog: (openRecoveryKeyDialog) =>
    set((state) => {
      state.openRecoveryKeyDialog = openRecoveryKeyDialog;
    }),
  setMasterKeyForUpdate: (masterKeyForUpdate) =>
    set((state) => {
      state.masterKeyForUpdate = masterKeyForUpdate;
    }),
});
