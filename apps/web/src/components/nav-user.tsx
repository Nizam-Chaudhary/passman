import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronsUpDown, LogOut, Settings2Icon } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

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
import { getInitials } from "@/lib/utils";
import { useGetUserDetails } from "@/services/queries/user";
import { useStore } from "@/stores";
import { useAuthStore } from "@/stores/auth";

import NavUserSkeleton from "./skeletons/nav-user-skeleton";

export function NavUser() {
  const { data: response, isPending, isError } = useGetUserDetails();
  const user = response?.data;

  const { authActions } = useAuthStore(
    useShallow((state) => ({
      authActions: state.actions,
    })),
  );

  const { setMasterKey, setRecoveryKey } = useStore(
    useShallow((state) => ({
      setMasterKey: state.setMasterKey,
      setRecoveryKey: state.setRecoveryKey,
    })),
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

  const logout = () => {
    authActions.logout();
    setMasterKey(null);
    setRecoveryKey("");
    navigate({ to: "/login" });
    toast({
      description: "Logged out successfully",
      className: "bg-green-700 text-bold",
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
                  alt={user?.userName?.charAt(0).toUpperCase()}
                />
                <AvatarFallback>{user?.userName ? getInitials(user.userName) : ""}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.userName}</span>
                <span className="truncate text-xs">{user?.email}</span>
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
                  <AvatarImage loading="lazy" src={user?.file?.url} />
                  <AvatarFallback>
                    {user?.userName ? getInitials(user.userName) : ""}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.userName}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to="/settings">
                <DropdownMenuItem>
                  <Settings2Icon />
                  Settings
                </DropdownMenuItem>
              </Link>
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
