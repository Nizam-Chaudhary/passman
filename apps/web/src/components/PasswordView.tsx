import type { SubmitHandler } from "react-hook-form";
import type { UpdatePasswordForm } from "@/schema/password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { ClipboardCopyIcon, TrashIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/react/shallow";
import { toast } from "@/hooks/use-toast";
import { encrypt } from "@/lib/encryption.helper";
import { getInitials } from "@/lib/utils";
import { upddatePasswordForm } from "@/schema/password";
import { useDeletePassword, useUpdatePassword } from "@/services/mutations/password";
import { useGetPasswordById } from "@/services/queries/password";
import { useStore } from "@/stores";
import ConfirmDialog from "./ConfirmDialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import Loading from "./ui/loading";
import { PasswordInput } from "./ui/password-input";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

const routeApi = getRouteApi("/_auth/");
export function PasswordView() {
  const queryClient = useQueryClient();
  const searchParams = routeApi.useSearch();
  const navigate = routeApi.useNavigate();

  const { setOpenDeletePasswordDialog, masterKey } = useStore(
    useShallow((state) => ({
      setOpenDeletePasswordDialog: state.setOpenDeletePasswordDialog,
      masterKey: state.masterKey,
    })),
  );
  const passwordId = searchParams.p;
  const {
    data: response,
    isPending,
    isError,
  } = useGetPasswordById({
    param: { id: Number(passwordId) },
    masterKey: masterKey!,
  });
  const editPasswordMutation = useUpdatePassword();
  const deletePasswordMutation = useDeletePassword();

  const editPasswordForm = useForm<UpdatePasswordForm>({
    resolver: zodResolver(upddatePasswordForm),
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
      password: response?.decryptedPassword || "",
      note: response?.data.note || "",
    });
  }, [response, editPasswordForm]);

  if (!passwordId) {
    return (
      <Card className="h-[calc(100vh-5.5rem)]">
        <CardContent>
          <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-8">
            <img className="w-[30vh]" src="/assets/select.svg" />
            <p className="mt-2 text-3xl">Select password from list</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isPending) {
    return (
      <Card className="h-[calc(100vh-5.5rem)]">
        <CardContent>
          <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
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
          <div className="flex h-[calc(100vh-5.5rem)] items-center justify-center">
            <div className="mt-20 flex flex-col items-center justify-center gap-8">
              <img className="w-[50%]" src="/assets/warning.svg" />
              <p className="mt-2 text-3xl">Password not found</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const onEditSubmit: SubmitHandler<UpdatePasswordForm> = async (data) => {
    if (!masterKey) {
      toast({
        title: "Error encrypting password!",
        description: "User key not found",
        className: "bg-red-700",
      });
      return;
    }
    const encryptedPassword = await encrypt(data.password, masterKey);
    const updatedPassword = {
      ...data,
      password: encryptedPassword,
    };

    editPasswordMutation.mutate(
      { body: updatedPassword, param: { id: Number(passwordId) } },
      {
        onError: (error) => {
          toast({
            className: "bg-red-700",
            description: error.message,
          });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["passwords"],
          });
          queryClient.invalidateQueries({
            queryKey: ["decryptPassword"],
          });
          toast({
            title: "Password updated successfully.",
            className: "bg-green-700",
          });
        },
      },
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
          navigate({ search: (prev) => ({ ...prev, p: undefined }) });
          queryClient.invalidateQueries({
            queryKey: ["passwords"],
          });
          toast({
            title: "Password deleted successfully.",
            className: "bg-green-700",
          });
          setOpenDeletePasswordDialog(false);
        },
      },
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
              <div className="flex items-center justify-between">
                <Avatar className="size-12 rounded-lg">
                  <AvatarImage loading="lazy" src={response.data.faviconUrl ?? ""} />
                  <AvatarFallback>{getInitials(response.data.url)}</AvatarFallback>
                </Avatar>

                <Button
                  variant="destructive"
                  className="size-10 bg-red-600 hover:bg-red-700"
                  onClick={() => setOpenDeletePasswordDialog(true)}
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
                onSubmit={editPasswordForm.handleSubmit(onEditSubmit)}
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
                            value={field.value || ""}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute right-0 top-0 h-full cursor-pointer hover:bg-transparent"
                            onClick={(e) => {
                              e.preventDefault();
                              copyToClipboard(field.value ?? "");
                              toast({
                                className: "bg-green-700",
                                description: "Username copied to clipboard",
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
                            className="absolute right-8 top-0 h-full cursor-pointer hover:bg-transparent"
                            onClick={(e) => {
                              e.preventDefault();
                              copyToClipboard(field.value ?? "");
                              toast({
                                className: "bg-green-700",
                                description: "Password copied to clipboard",
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
                  className="w-full bg-blue-700 text-center text-white hover:bg-blue-600"
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
