import { useGetApiV1Vaults } from "@/api-client/api";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/store";
import { Check, ChevronsUpDown, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
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

export function VaultComboBox() {
    const [open, setOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const { currentVault, setCurrentVault, setOpenAddVaultDialog } = useStore(
        useShallow((state) => ({
            currentVault: state.currentVault,
            setCurrentVault: state.setCurrentVault,
            setOpenAddVaultDialog: state.setOpenAddVaultDialog,
        }))
    );
    const { data: response } = useGetApiV1Vaults();

    useEffect(() => {
        if (response?.data) {
            setCurrentVault(
                response.data.find((vault) => vault.name === "Default")
            );
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
                        className="justify-between w-[200px]"
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
                                {(response?.data || []).map((vault, index) => (
                                    <CommandItem
                                        key={index}
                                        value={vault.name}
                                        onSelect={(vault) => {
                                            if (vault != currentVault?.name) {
                                                searchParams.delete("p");
                                                setSearchParams(searchParams);
                                            }
                                            setCurrentVault(
                                                response?.data.find(
                                                    (val) => val.name === vault
                                                )
                                            );
                                            setOpen(false);
                                        }}
                                    >
                                        {vault.name}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                vault.id === currentVault?.id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                                {response?.data &&
                                response?.data?.length < 5 ? (
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
