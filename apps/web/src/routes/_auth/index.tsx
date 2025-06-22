import AddPassword from "@/components/AddPassword";
import { AppSidebar } from "@/components/AppSidebar";
import { PasswordList } from "@/components/PasswordList";
import { PasswordView } from "@/components/PasswordView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { VaultComboBox } from "@/components/VaultComboBox";
import { useStore } from "@/stores";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { debounce } from "lodash";
import { KeyRound, LockIcon, Search } from "lucide-react";
import { useEffect, useMemo } from "react";
import z from "zod/v4";
import { useShallow } from "zustand/react/shallow";

const homeSearchSchema = z.object({
    q: z.string().default("").optional(),
    p: z.number().min(1).optional(),
});

export const Route = createFileRoute("/_auth/")({
    component: Home,
    validateSearch: zodValidator(homeSearchSchema),
});

function Home() {
    const { setOpenAddPasswordDialog } = useStore(
        useShallow((state) => ({
            setOpenAddPasswordDialog: state.setOpenAddPasswordDialog,
        }))
    );

    const searchParams = Route.useSearch();
    const navigate = useNavigate();

    const debouncedSearch = useMemo(
        () =>
            debounce((searchTerm: string) => {
                if (searchTerm === "") {
                    navigate({ to: ".", search: () => ({}) });
                } else {
                    navigate({ to: ".", search: () => ({ q: "" }) });
                }
            }, 500),
        [navigate]
    );

    // Cleanup the debounced function on unmount
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <div className="w-[100%]">
                    <div className="flex items-center justify-between pt-4 px-2">
                        <SidebarTrigger className="align-middle size-6 ms-2 mr-4" />
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <VaultComboBox />
                                <LockIcon className="size-4 opacity-60 ml-3" />
                            </div>
                        </div>
                        <div className="flex items-center flex-1 justify-end">
                            <div className="flex flex-[0.5] items-center relative">
                                <Input
                                    className="pr-10"
                                    placeholder="Search"
                                    onChange={(e) => {
                                        const searchTerm = e.target.value;
                                        debouncedSearch(searchTerm);
                                    }}
                                    defaultValue={searchParams.q ?? ""}
                                />
                                <Search className="absolute right-3 w-5 h-5 text-gray-500 pointer-events-none" />
                            </div>
                            <Button
                                variant="default"
                                className="ms-2 flex justify-between items-center"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setOpenAddPasswordDialog(true);
                                }}
                            >
                                Add Password
                                <KeyRound />
                            </Button>
                        </div>
                    </div>
                    <main className="p-4">
                        <AddPassword />
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <PasswordList />
                            </div>
                            <div className="flex-[1.5]">
                                <PasswordView />
                            </div>
                        </div>
                    </main>
                </div>
            </SidebarProvider>
        </div>
    );
}
