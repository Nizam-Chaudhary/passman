import { useAuthStore } from "@/stores/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

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
