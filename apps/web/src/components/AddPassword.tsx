import type { Password } from "@/types/password";
import type { SubmitHandler } from "react-hook-form";
import {
    getGetApiV1PasswordsQueryKey,
    usePostApiV1Passwords,
} from "@/api-client/api";
import { useToast } from "@/hooks/use-toast";
import { encrypt } from "@/lib/encryption.helper";
import { useStore } from "@/store/store";
import { passwordPayloadSchema, passwordSchema } from "@/types/password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import LoadingSpinner from "./ui/loadingSpinner";
import { PasswordInput } from "./ui/password-input";
import { Textarea } from "./ui/textarea";
import { useQueryClient } from "@tanstack/react-query";

export default function AddPassword() {
    const queryClient = useQueryClient();
    const {
        openAddPasswordDialog,
        setOpenAddPasswordDialog,
        masterKey,
        currentVault,
    } = useStore(
        useShallow((state) => ({
            openAddPasswordDialog: state.openAddPasswordDialog,
            setOpenAddPasswordDialog: state.setOpenAddPasswordDialog,
            masterKey: state.masterKey,
            currentVault: state.currentVault,
        }))
    );
    const { toast } = useToast();

    const addPasswordMutation = usePostApiV1Passwords();
    const form = useForm<Password>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            username: "",
            password: "",
            url: "",
            note: "",
        },
    });

    const onSubmit: SubmitHandler<Password> = async (data) => {
        if (!masterKey) {
            toast({
                className: "bg-red-700",
                title: "Error encrypting password!",
                description: "User key not found",
            });
            return;
        }
        const encryptedPassword = await encrypt(data.password, masterKey);
        const payload = passwordPayloadSchema.parse({
            ...data,
            password: encryptedPassword,
            vaultId: currentVault?.id,
        });

        addPasswordMutation.mutate(
            { data: payload },
            {
                onError: (error) => {
                    toast({
                        className: "bg-red-500",
                        description: error.message,
                    });
                },
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: getGetApiV1PasswordsQueryKey({
                            vaultId: currentVault!.id,
                        }),
                    });
                    toast({
                        title: "Password added successfully.",
                        className: "bg-green-700",
                    });
                    setOpenAddPasswordDialog(false);
                    form.reset();
                },
            }
        );
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
                    <form
                        autoComplete="off"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-2"
                    >
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
                            <Button
                                type="submit"
                                className="w-16"
                                disabled={addPasswordMutation.isPending}
                            >
                                {addPasswordMutation.isPending ? (
                                    <LoadingSpinner />
                                ) : (
                                    "Add"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
