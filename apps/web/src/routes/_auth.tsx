import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
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
  return <Outlet />;
}
