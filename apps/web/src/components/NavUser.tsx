"use client";

import { useGetApiV1Users } from "@/api-client/api";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { removeRefreshToken, removeToken } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { useStore } from "@/store/store";
import { ChevronsUpDown, LogOut, Settings2Icon } from "lucide-react";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";
import NavUserSkeleton from "./skeletons/NavUserSkeleton";
import { getInitials } from "@/lib/utils";

export function NavUser() {
    const { data: response, isPending, isError } = useGetApiV1Users();
    const user = response?.data;

    const {
        setIsAuthenticated,
        setIsEmailVerified,
        setIsMasterPasswordSet,
        setUserKey,
        setMasterkey,
        setRecoveryKey,
    } = useStore(
        useShallow((state) => ({
            setIsAuthenticated: state.setIsAuthenticated,
            setIsEmailVerified: state.setIsEmailVerified,
            setIsMasterPasswordSet: state.setIsMasterPasswordSet,
            setUserKey: state.setUserKey,
            setMasterkey: state.setMasterkey,
            setRecoveryKey: state.setRecoveryKey,
        }))
    );

    const { isMobile } = useSidebar();
    const { toast } = useToast();
    const navigate = useNavigate();

    if (isPending) {
        return <NavUserSkeleton />;
    }

    if (isError) {
        return <NavUserSkeleton />;
    }

    const openSettings = () => {
        navigate(ROUTES.SETTINGS);
    };

    const logout = () => {
        removeToken();
        removeRefreshToken();
        setIsAuthenticated(false);
        setIsEmailVerified(null);
        setIsMasterPasswordSet(null);
        setUserKey(null);
        setMasterkey(null);
        setRecoveryKey("");
        navigate(ROUTES.LOGIN);
        toast({
            description: "Logged out successfully",
            className: "bg-green-700",
        });
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={user?.file?.url || user?.userName}
                                    alt={user?.userName
                                        ?.charAt(0)
                                        .toUpperCase()}
                                />
                                <AvatarFallback>
                                    {user?.userName
                                        ? getInitials(user.userName)
                                        : ""}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {user?.userName}
                                </span>
                                <span className="truncate text-xs">
                                    {user?.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        loading="lazy"
                                        src={user?.file?.url}
                                    />
                                    <AvatarFallback>
                                        {user?.userName
                                            ? getInitials(user.userName)
                                            : ""}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {user?.userName}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user?.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={openSettings}>
                                <Settings2Icon />
                                Settings
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
