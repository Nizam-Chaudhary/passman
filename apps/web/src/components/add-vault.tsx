import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { addVaultBodySchema } from "@passman/schema/api";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import { useAddVault } from "@/services/mutations/vault";
import { useStore } from "@/stores";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import LoadingSpinner from "./ui/loading-spinner";

export default function AddVault() {
  const queryClient = useQueryClient();
  const { open, setOpen } = useStore(
    useShallow((state) => ({
      open: state.openAddVaultDialog,
      setOpen: state.setOpenAddVaultDialog,
    })),
  );

  const form = useForm<{ name: string }>({
    resolver: zodResolver(addVaultBodySchema),
    defaultValues: {
      name: "",
    },
  });

  const addVaultMutation = useAddVault();

  const onSubmit: SubmitHandler<{ name: string }> = (data) => {
    addVaultMutation.mutate(data, {
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["vaults"],
        });
        toast.success("Vault added successfully.");
        setOpen(false);
        form.reset();
      },
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Vault</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Vault Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="name"
                      type="text"
                      placeholder="Enter Vault name"
                      className="mt-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-16" disabled={addVaultMutation.isPending}>
                {addVaultMutation.isPending ? <LoadingSpinner /> : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
