import type { Password } from "@/types/password";
import type { SubmitHandler } from "react-hook-form";
import {
    getGetApiV1PasswordsQueryKey,
    useDeleteApiV1PasswordsId,
    useGetApiV1PasswordsId,
    usePutApiV1PasswordsId,
} from "@/api-client/api";
import { toast } from "@/hooks/use-toast";
import { decrypt, encrypt } from "@/lib/encryption.helper";
import { useStore } from "@/store/store";
import { passwordSchema, updatePasswordPayloadSchema } from "@/types/password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardCopyIcon, TrashIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import ConfirmDialog from "./ConfirmDialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import Loading from "./ui/loading";
import { PasswordInput } from "./ui/password-input";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { getInitials } from "@/lib/utils";

export function PasswordView() {
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();

    const { setOpenDeletePasswordDialog, masterKey, currentVault } = useStore(
        useShallow((state) => ({
            setOpenDeletePasswordDialog: state.setOpenDeletePasswordDialog,
            masterKey: state.masterKey,
            currentVault: state.currentVault,
        }))
    );
    const passwordId = searchParams.get("p");
    const {
        data: response,
        isPending,
        isError,
    } = useGetApiV1PasswordsId(Number(passwordId), {
        query: { enabled: !!passwordId },
    });
    const editPasswordMutation = usePutApiV1PasswordsId();
    const deletePasswordMutation = useDeleteApiV1PasswordsId();

    const { data: password } = useQuery({
        queryKey: ["decryptPassword", { id: passwordId }],
        queryFn: async () => {
            if (!masterKey || !response?.data.password) return null;
            return await decrypt(response?.data.password, masterKey);
        },
        enabled: !!response?.data.password && masterKey != null,
    });

    const editPasswordForm = useForm<Password>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            url: "",
            username: "",
            password: "",
            note: "",
        },
    });

    useEffect(() => {
        editPasswordForm.reset({
            url: response?.data.url || "",
            username: response?.data.username || "",
            password: password || "",
            note: response?.data.note || "",
        });
    }, [password, response, editPasswordForm]);

    if (!passwordId) {
        return (
            <Card className="h-[calc(100vh-5.5rem)]">
                <CardContent>
                    <div className="flex flex-col justify-center items-center h-[calc(100vh-10rem)] gap-8">
                        <img className="w-[30vh]" src="/assets/select.svg" />
                        <p className="text-3xl mt-2">
                            Select password from list
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isPending) {
        return (
            <Card className="h-[calc(100vh-5.5rem)]">
                <CardContent>
                    <div className="h-[calc(100vh-10rem)] flex items-center justify-center">
                        <Loading />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="h-[calc(100vh-5.5rem)]">
                <CardContent>
                    <div className="h-[calc(100vh-5.5rem)] flex items-center justify-center">
                        <div className="flex flex-col justify-center items-center mt-20 gap-8">
                            <img
                                className="w-[50%]"
                                src="/assets/warning.svg"
                            />
                            <p className="text-3xl mt-2">Password not found</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const onEditSubmit: SubmitHandler<Password> = async (data) => {
        if (!masterKey) {
            toast({
                title: "Error encrypting password!",
                description: "User key not found",
                className: "bg-red-700",
            });
            return;
        }
        const encryptedPassword = await encrypt(data.password, masterKey);
        const updatedPassword = updatePasswordPayloadSchema.parse({
            ...data,
            password: encryptedPassword,
        });

        editPasswordMutation.mutate(
            { data: updatedPassword, id: Number(passwordId) },
            {
                onError: (error) => {
                    toast({
                        className: "bg-red-700",
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
                        title: "Password updated successfully.",
                        className: "bg-green-700",
                    });
                },
            }
        );
    };

    const onDeletePassword = () => {
        deletePasswordMutation.mutate(
            { id: Number(passwordId) },
            {
                onError: (error) => {
                    toast({
                        className: "bg-red-700",
                        description: error.message,
                    });
                },
                onSuccess: () => {
                    searchParams.delete("p");
                    setSearchParams(searchParams);
                    console.log(
                        "queryKey",
                        getGetApiV1PasswordsQueryKey({
                            vaultId: currentVault!.id,
                        })
                    );
                    queryClient.invalidateQueries({
                        queryKey: getGetApiV1PasswordsQueryKey({
                            vaultId: currentVault!.id,
                        }),
                    });
                    toast({
                        title: "Password deleted successfully.",
                        className: "bg-green-700",
                    });
                    setOpenDeletePasswordDialog(false);
                },
            }
        );
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({
                className: "bg-green-700",
                description: "Copied to clipboard",
            });
        } catch {
            toast({
                className: "bg-red-700",
                description: "Failed to copy to clipboard",
            });
        }
    };

    return (
        <>
            <Card className="h-[calc(100vh-5.5rem)]">
                <ScrollArea className="h-[calc(100vh-5.5rem)]">
                    <CardHeader>
                        <div>
                            <div className="flex justify-between items-center">
                                <Avatar className="size-12 rounded-lg">
                                    <AvatarImage
                                        loading="lazy"
                                        src={response.data.faviconUrl ?? ""}
                                    />
                                    <AvatarFallback>
                                        {getInitials(response.data.url)}
                                    </AvatarFallback>
                                </Avatar>

                                <Button
                                    variant="destructive"
                                    className="size-10 bg-red-600 hover:bg-red-700"
                                    onClick={() =>
                                        setOpenDeletePasswordDialog(true)
                                    }
                                >
                                    <TrashIcon />
                                </Button>
                            </div>
                            <Separator className="mt-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Form {...editPasswordForm}>
                            <form
                                autoComplete="off"
                                onSubmit={editPasswordForm.handleSubmit(
                                    onEditSubmit
                                )}
                                className="space-y-2"
                            >
                                <FormField
                                    control={editPasswordForm.control}
                                    name="url"
                                    render={({ field }) => (
                                        <FormItem className="mt-2">
                                            <FormLabel>Url</FormLabel>
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
                                <FormField
                                    control={editPasswordForm.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className="mt-2">
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        id="username"
                                                        type="text"
                                                        placeholder="Enter Username"
                                                        className="mt-2"
                                                        autoComplete="new-password"
                                                        autoCorrect="off"
                                                        autoCapitalize="off"
                                                        spellCheck="false"
                                                        value={
                                                            field.value || ""
                                                        }
                                                    />
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="absolute top-0 right-0 cursor-pointer h-full hover:bg-transparent"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            copyToClipboard(
                                                                field.value ??
                                                                    ""
                                                            );
                                                            toast({
                                                                className:
                                                                    "bg-green-700",
                                                                description:
                                                                    "Username copied to clipboard",
                                                            });
                                                        }}
                                                    >
                                                        <ClipboardCopyIcon />
                                                    </Button>
                                                </div>
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={editPasswordForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="mt-2">
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <PasswordInput
                                                        {...field}
                                                        id="password"
                                                        placeholder="Enter Password"
                                                        autoComplete="new-password"
                                                        autoCorrect="off"
                                                        autoCapitalize="off"
                                                        spellCheck="false"
                                                        className="mt-2"
                                                    />

                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="absolute top-0 right-8 cursor-pointer h-full hover:bg-transparent"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            copyToClipboard(
                                                                field.value ??
                                                                    ""
                                                            );
                                                            toast({
                                                                className:
                                                                    "bg-green-700",
                                                                description:
                                                                    "Password copied to clipboard",
                                                            });
                                                        }}
                                                    >
                                                        <ClipboardCopyIcon />
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={editPasswordForm.control}
                                    name="note"
                                    render={({ field }) => (
                                        <FormItem className="mt-2">
                                            <FormLabel>Note</FormLabel>
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
                                <Button
                                    className="text-center w-full bg-blue-700 hover:bg-blue-600 text-white"
                                    type="submit"
                                >
                                    Save
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </ScrollArea>
            </Card>

            <ConfirmDialog
                title="Delete Password"
                description="Are you sure you want to delete the password?"
                variant="destructive"
                onClick={onDeletePassword}
                isPending={deletePasswordMutation.isPending}
            />
        </>
    );
}
