import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/_auth")({
  beforeLoad: () => {
    const { isLoggedIn, isAuthenticated, isMasterPasswordCreated } = useAuthStore.getState();

    if (!isLoggedIn) {
      throw redirect({
        to: "/login",
      });
    } else if (!isMasterPasswordCreated) {
      throw redirect({
        to: "/master-password/create",
      });
    } else if (!isAuthenticated) {
      throw redirect({
        to: "/master-password/verify",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-[100%]">
          <Outlet />
        </div>
      </SidebarProvider>
    </div>
  );
}
