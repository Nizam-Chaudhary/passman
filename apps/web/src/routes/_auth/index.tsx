import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { debounce } from "lodash";
import { KeyRound, LockIcon, Search } from "lucide-react";
import { useEffect, useMemo } from "react";
import z from "zod/v4";
import { useShallow } from "zustand/react/shallow";

import AddPassword from "@/components/add-password";
import { PasswordList } from "@/components/password-list";
import { SelectionToolbar } from "@/components/selection-toolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { VaultComboBox } from "@/components/vault-combo-box";
import { useStore } from "@/stores";

const homeSearchSchema = z.object({
  q: z.string().optional().catch(undefined),
  p: z.number().min(1).optional().catch(undefined),
});

export const Route = createFileRoute("/_auth/")({
  component: Home,
  validateSearch: homeSearchSchema,
});

function Home() {
  const { setOpenAddPasswordDialog } = useStore(
    useShallow((state) => ({
      setOpenAddPasswordDialog: state.setOpenAddPasswordDialog,
    })),
  );

  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  const debouncedSearch = useMemo(
    () =>
      debounce((searchTerm: string) => {
        if (searchTerm === "") {
          navigate({
            to: ".",
            search: (prev) => ({ ...prev, q: undefined }),
          });
        } else {
          navigate({
            to: ".",
            search: (prev) => ({ ...prev, q: searchTerm }),
          });
        }
      }, 500),
    [navigate],
  );

  // Cleanup the debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div>
      <div className="flex items-center justify-between px-2 pt-4">
        <SidebarTrigger className="mr-4 ms-2 size-6 align-middle" />
        <div className="flex items-center">
          <div className="flex items-center">
            <VaultComboBox />
            <LockIcon className="ml-3 size-4 opacity-60" />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <div className="relative flex flex-[0.5] items-center">
            <Input
              className="pr-10"
              placeholder="Search"
              onChange={(e) => {
                const searchTerm = e.target.value;
                debouncedSearch(searchTerm);
              }}
              defaultValue={searchParams.q ?? ""}
            />
            <Search className="pointer-events-none absolute right-3 h-5 w-5 text-gray-500" />
          </div>
          <Button
            variant="default"
            className="ms-2 flex items-center justify-between"
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
        <PasswordList />
        <SelectionToolbar />
      </main>
    </div>
  );
}
