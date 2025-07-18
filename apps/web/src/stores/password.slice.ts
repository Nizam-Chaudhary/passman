import type { StateCreator } from "zustand";

import type { Store } from "@/stores";
import type { Prettify } from "@/vite-env";

interface PasswordStates {
  openDeletePasswordDialog: boolean;
  openAddPasswordDialog: boolean;
}

interface PasswordActions {
  setOpenDeletePasswordDialog: (open: boolean) => void;
  setOpenAddPasswordDialog: (open: boolean) => void;
}

const initialState: PasswordStates = {
  openDeletePasswordDialog: false,
  openAddPasswordDialog: false,
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
});
