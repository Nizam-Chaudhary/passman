import type { MasterPasswordSlice } from "./masterPassword.slice";
import type { PasswordSlice } from "./password.slice";
import type { SidebarSlice } from "./sidebar.slice";
import type { TimerSlice } from "./timer.slice";
import type { VaultSlice } from "./vault.slice";
import type { Prettify } from "@/vite-env";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createMasterPasswordSlice } from "./masterPassword.slice";
import { createPasswordSlice } from "./password.slice";
import { createSidebarSlice } from "./sidebar.slice";
import { createTimerSlice } from "./timer.slice";
import { createVaultSlice } from "./vault.slice";

export type Store = Prettify<
  VaultSlice & SidebarSlice & PasswordSlice & TimerSlice & MasterPasswordSlice
>;

export const useStore = create<Store>()(
  devtools(
    subscribeWithSelector(
      immer((...a) => ({
        ...createVaultSlice(...a),
        ...createSidebarSlice(...a),
        ...createPasswordSlice(...a),
        ...createMasterPasswordSlice(...a),
        ...createTimerSlice(...a),
      }))
    )
  )
);
