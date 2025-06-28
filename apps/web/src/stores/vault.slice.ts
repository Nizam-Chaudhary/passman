import type { Vault } from "@passman/schema/api";
import type { StateCreator } from "zustand";
import type { Store } from "@/stores";

interface VaultStates {
  currentVault?: Vault;
  openAddVaultDialog: boolean;
}

interface VaultActions {
  setCurrentVault: (vault?: Vault) => void;
  setOpenAddVaultDialog: (open: boolean) => void;
}

const initialState: VaultStates = {
  currentVault: undefined,
  openAddVaultDialog: false,
};

export type VaultSlice = VaultStates & VaultActions;

export const createVaultSlice: StateCreator<Store, [["zustand/immer", never]], [], VaultSlice> = (
  set
) => ({
  ...initialState,
  setCurrentVault: (vault) =>
    set((state) => {
      state.currentVault = vault;
    }, false),
  setOpenAddVaultDialog: (open) =>
    set((state) => {
      state.openAddVaultDialog = open;
    }),
});
