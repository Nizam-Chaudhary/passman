import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/_onboard")({
  component: OnBoard,
  beforeLoad: () => {
    if (useAuthStore.getState().isLoggedIn) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function OnBoard() {
  return <Outlet />;
}
