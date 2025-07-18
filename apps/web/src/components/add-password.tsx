import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import type { AddPasswordForm } from "@/schema/password";

import { encrypt } from "@/lib/encryption-helper";
import { addPasswordFormSchema } from "@/schema/password";
import { useAddPassword } from "@/services/mutations/password";
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
import { PasswordInput } from "./ui/password-input";
import { Textarea } from "./ui/textarea";

export default function AddPassword() {
  const queryClient = useQueryClient();
  const { openAddPasswordDialog, setOpenAddPasswordDialog, masterKey, currentVault } = useStore(
    useShallow((state) => ({
      openAddPasswordDialog: state.openAddPasswordDialog,
      setOpenAddPasswordDialog: state.setOpenAddPasswordDialog,
      masterKey: state.masterKey,
      currentVault: state.currentVault,
    })),
  );

  const addPasswordMutation = useAddPassword();
  const form = useForm<AddPasswordForm>({
    resolver: zodResolver(addPasswordFormSchema),
    defaultValues: {
      username: "",
      password: "",
      url: "",
      note: "",
    },
  });

  const onSubmit: SubmitHandler<AddPasswordForm> = async (data) => {
    if (!masterKey) {
      toast.error("Error encrypting password!", { description: "User key not found" });
      return;
    }
    if (!currentVault) {
      toast.error("Error adding password!", { description: "Please select any vault" });
      return;
    }
    const encryptedPassword = await encrypt(data.password, masterKey);
    const payload = {
      ...data,
      password: encryptedPassword,
      vaultId: currentVault?.id,
    };

    addPasswordMutation.mutate(payload, {
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["passwords"],
        });
        toast.success("Password added successfully.");
        setOpenAddPasswordDialog(false);
        form.reset();
      },
    });
  };

  const onOpenChange = (value: boolean) => {
    form.clearErrors();
    setOpenAddPasswordDialog(value);
  };
  return (
    <Dialog open={openAddPasswordDialog} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Password</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            {/* Url Field */}
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="url"
                      type="text"
                      placeholder="Enter URL"
                      className="mt-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="username"
                      type="text"
                      placeholder="Enter Username"
                      className="mt-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      id="password"
                      placeholder="Enter Password"
                      className="mt-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Notes Field */}
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="note"
                      rows={6}
                      className="mt-2 max-h-[150px]"
                      placeholder="Enter Note"
                      value={field.value || ""}
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
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-16" disabled={addPasswordMutation.isPending}>
                {addPasswordMutation.isPending ? <LoadingSpinner /> : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
