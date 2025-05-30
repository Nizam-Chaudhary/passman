import type { AuthSlice } from "@/store/auth.slice";
import type { PasswordSlice } from "@/store/password.slice";
import type { SidebarSlice } from "@/store/sidebar.slice";
import type { UserSlice } from "@/store/user.slice";
import type { VaultSlice } from "@/store/vault.slice";

export type Store = VaultSlice &
    SidebarSlice &
    PasswordSlice &
    AuthSlice &
    UserSlice;
