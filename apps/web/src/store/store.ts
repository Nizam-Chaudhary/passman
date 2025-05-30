import type { Store } from "@/types/store";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createAuthSlice } from "./auth.slice";
import { createPasswordSlice } from "./password.slice";
import { createSidebarSlice } from "./sidebar.slice";
import { createUserSlice } from "./user.slice";
import { createVaultSlice } from "./vault.slice";

export const useStore = create<Store>()(
    devtools(
        subscribeWithSelector(
            immer((...a) => ({
                ...createVaultSlice(...a),
                ...createSidebarSlice(...a),
                ...createPasswordSlice(...a),
                ...createAuthSlice(...a),
                ...createUserSlice(...a),
            }))
        )
    )
);
