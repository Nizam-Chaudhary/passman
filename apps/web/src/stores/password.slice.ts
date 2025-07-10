import type { StateCreator } from "zustand";

import type { Store } from "@/stores";
import type { Prettify } from "@/vite-env";

interface PasswordStates {
  openDeletePasswordDialog: boolean;
  openAddPasswordDialog: boolean;
  selectedPasswords: number[];
}

interface PasswordActions {
  setOpenDeletePasswordDialog: (open: boolean) => void;
  setOpenAddPasswordDialog: (open: boolean) => void;
  toggleSelectPassword: (id: number) => void;
  clearSelectedPasswords: () => void;
}

const initialState: PasswordStates = {
  openDeletePasswordDialog: false,
  openAddPasswordDialog: false,
  selectedPasswords: [],
};

export type PasswordSlice = Prettify<PasswordStates & PasswordActions>;

export const createPasswordSlice: StateCreator<
  Store,
  [["zustand/immer", never]],
  [],
  PasswordSlice
> = (set) => ({
  ...initialState,
  setOpenDeletePasswordDialog: (open) =>
    set((state) => {
      state.openDeletePasswordDialog = open;
    }),
  setOpenAddPasswordDialog: (open) =>
    set((state) => {
      state.openAddPasswordDialog = open;
    }),
  toggleSelectPassword: (id) =>
    set((state) => {
      if (state.selectedPasswords.includes(id)) {
        state.selectedPasswords = state.selectedPasswords.filter((p) => p !== id);
      } else {
        state.selectedPasswords.push(id);
      }
    }),
  clearSelectedPasswords: () =>
    set((state) => {
      state.selectedPasswords = [];
    }),
});
