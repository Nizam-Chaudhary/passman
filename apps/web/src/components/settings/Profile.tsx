import type { FileUploadResponse } from "@/types/file";
import type { SubmitHandler } from "react-hook-form";
import {
    getGetApiV1UsersQueryKey,
    useGetApiV1Users,
    usePatchApiV1Users,
} from "@/api-client/api";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FileUpload from "../FileUpload";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import Loading from "../ui/loading";
import LoadingSpinner from "../ui/loadingSpinner";
import { getInitials } from "@/lib/utils";

function Profile() {
    const queryClient = useQueryClient();
    const { data: response, isPending, isError } = useGetApiV1Users();
    const userDetails = response?.data;

    const userNameForm = useForm<{ userName: string }>({
        resolver: zodResolver(
            z.object({
                userName: z
                    .string()
                    .min(4, "Username must be at least 4 characters")
                    .max(50, "Username must be at most 50 characters"),
            })
        ),
        defaultValues: {
            userName: userDetails?.userName ?? "",
        },
    });
    const { toast } = useToast();

    const updateUserMutation = usePatchApiV1Users();

    if (isPending) {
        return (
            <div className="h-[300px] flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-[calc(100vh)] flex-col justify-center items-center gap-8">
                <img className="w-[40vh] mt-48" src="/assets/warning.svg" />
                <p className="text-3xl">Error fetching profile</p>
            </div>
        );
    }

    const onSubmit: SubmitHandler<{ userName: string }> = (data) => {
        updateUserMutation.mutate(
            { data },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: getGetApiV1UsersQueryKey(),
                        exact: true,
                    });
                    toast({
                        title: "Username updated successfully.",
                        className: "bg-green-700 text-white",
                    });
                },
            }
        );
    };

    const onFileUploadSuccess = (response: FileUploadResponse) => {
        updateUserMutation.mutate(
            { data: { fileId: response.data.id } },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: getGetApiV1UsersQueryKey(),
                        exact: true,
                    });
                    toast({
                        title: "Profile picture updated successfully.",
                        className: "bg-green-700 text-white",
                    });
                },
                onError: () => {
                    toast({
                        title: "Unable to update profile picture.",
                        className: "bg-red-600 text-white",
                    });
                },
            }
        );
    };

    return (
        <div className="space-y-4 p-2">
            <div className="flex items-center">
                <label htmlFor="file-upload" className="cursor-pointer">
                    <Avatar className="size-40 rounded-full hover:opacity-80 transition-opacity">
                        <AvatarImage
                            loading="lazy"
                            src={userDetails?.file?.url}
                        />
                        <AvatarFallback>
                            {userDetails?.userName
                                ? getInitials(userDetails.userName)
                                : ""}
                        </AvatarFallback>
                    </Avatar>
                    <FileUpload onSuccess={onFileUploadSuccess} />
                </label>
            </div>
            <div className="p-2">
                <div className="max-w-sm mb-2">
                    <p className="mb-1">Email</p>
                    <div className="border-[1px] px-3 py-[6px] rounded-md">
                        {userDetails?.email}
                    </div>
                </div>
                <Form {...userNameForm}>
                    <form
                        onSubmit={userNameForm.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={userNameForm.control}
                            name="userName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl className="mb-2 max-w-sm w-auto">
                                        <Input
                                            className="max-w-sm w-96"
                                            placeholder="Enter Username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-20"
                            disabled={updateUserMutation.isPending}
                        >
                            {updateUserMutation.isPending ? (
                                <LoadingSpinner />
                            ) : (
                                "Update"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default Profile;
