import { AppSidebar } from "@/components/AppSidebar";
import { PasswordList } from "@/components/PasswordList";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useStore } from "@/store/store";
import debounce from "lodash/debounce";
import { KeyRound, LockIcon, Search } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import AddPassword from "../components/AddPassword";
import { PasswordView } from "../components/PasswordView";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { VaultComboBox } from "../components/VaultComboBox";

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();

    const { setOpenAddPasswordDialog } = useStore(
        useShallow((state) => ({
            setOpenAddPasswordDialog: state.setOpenAddPasswordDialog,
        }))
    );

    // const refreshTokenMutation = useRefreshToken();

    // useLayoutEffect(() => {
    //   const token = getToken();
    //   if (token) {
    //     setRequestInterceptor();
    //   }
    //   setResponseInterceptor(refreshTokenMutation);
    // }, [refreshTokenMutation]);

    const debouncedSearch = useMemo(
        () =>
            debounce((searchTerm: string) => {
                if (searchTerm === "") {
                    searchParams.delete("q");
                } else {
                    searchParams.set("q", searchTerm);
                }
                setSearchParams(searchParams);
            }, 500),
        [searchParams, setSearchParams]
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
                                    defaultValue={searchParams.get("q") || ""}
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
