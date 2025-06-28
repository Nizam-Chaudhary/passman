import { getRouteApi } from "@tanstack/react-router";
import { Check, ChevronsUpDown, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { useGetVaults } from "@/services/queries/vault";
import { useStore } from "@/stores";
import AddVault from "./AddVault";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const routeApi = getRouteApi("/_auth/");
export function VaultComboBox() {
  const [open, setOpen] = useState(false);
  const navigate = routeApi.useNavigate();
  const { currentVault, setCurrentVault, setOpenAddVaultDialog } = useStore(
    useShallow((state) => ({
      currentVault: state.currentVault,
      setCurrentVault: state.setCurrentVault,
      setOpenAddVaultDialog: state.setOpenAddVaultDialog,
    }))
  );
  const { data: response } = useGetVaults();

  useEffect(() => {
    if (response?.data) {
      setCurrentVault(response.data.find((vault) => vault.name === "Default"));
    }
  }, [response, setCurrentVault]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {currentVault?.name}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Default" />
            <CommandList>
              <CommandEmpty>No vaults added...</CommandEmpty>
              <CommandGroup>
                {(response?.data || []).map((vault) => (
                  <CommandItem
                    key={vault.name}
                    value={vault.name}
                    onSelect={(vault) => {
                      if (vault !== currentVault?.name) {
                        navigate({
                          search: {
                            q: undefined,
                            p: undefined,
                          },
                        });
                      }
                      setCurrentVault(response?.data.find((val) => val.name === vault));
                      setOpen(false);
                    }}
                  >
                    {vault.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        vault.id === currentVault?.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
                {response?.data && response?.data?.length < 5 ? (
                  <CommandItem
                    value="Add Vault"
                    onSelect={() => {
                      setOpenAddVaultDialog(true);
                      setOpen(false);
                    }}
                  >
                    <p>Add Vault</p>
                    <PlusIcon className="ml-auto" />
                  </CommandItem>
                ) : null}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <AddVault />
    </>
  );
}
