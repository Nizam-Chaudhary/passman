import type { Store } from "@/types/store";
import type { StateCreator } from "zustand";

interface SidebarStates {
    currentMainNav: "Passwords" | "Notes";
}

interface SidebarActions {
    setCurrentMainNav: (nav: "Passwords" | "Notes") => void;
}

const initialState: SidebarStates = {
    currentMainNav: "Passwords",
};

export type SidebarSlice = SidebarStates & SidebarActions;

export const createSidebarSlice: StateCreator<
    Store,
    [["zustand/immer", never]],
    [],
    SidebarSlice
> = (set) => ({
    ...initialState,
    setCurrentMainNav: (nav) =>
        set((state) => {
            state.currentMainNav = nav;
        }),
});
