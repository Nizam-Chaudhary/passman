import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import type { FileUploadResponse } from "@/schema/file";

// import {
//     getGetApiV1UsersQueryKey,
//     useGetApiV1Users,
//     usePatchApiV1Users,
// } from "@/api-client/api";
import { getInitials } from "@/lib/utils";
import { useUpdateUser } from "@/services/mutations/user";
import { useGetUserDetails } from "@/services/queries/user";

import FileUpload from "../file-upload";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import LoadingSpinner from "../ui/loading-spinner";

function Profile() {
  const queryClient = useQueryClient();
  const { data: response, isPending, isError } = useGetUserDetails();
  const userDetails = response?.data;

  const userNameForm = useForm<{ userName: string }>({
    resolver: zodResolver(
      z.object({
        userName: z
          .string()
          .min(4, "Username must be at least 4 characters")
          .max(50, "Username must be at most 50 characters"),
      }),
    ),
    defaultValues: {
      userName: userDetails?.userName ?? "",
    },
  });

  const updateUserMutation = useUpdateUser();

  if (isPending) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[calc(100vh)] flex-col items-center justify-center gap-8">
        <img className="mt-48 w-[40vh]" src="/assets/warning.svg" />
        <p className="text-3xl">Error fetching profile</p>
      </div>
    );
  }

  const onSubmit: SubmitHandler<{ userName: string }> = (data) => {
    updateUserMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["users"],
        });
        toast.success("Username updated successfully.");
      },
    });
  };

  const onFileUploadSuccess = (response: FileUploadResponse) => {
    updateUserMutation.mutate(
      { fileId: response.data.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["users"],
          });
          toast.success("Profile picture updated successfully.");
        },
        onError: () => {
          toast.error("Unable to update profile picture.");
        },
      },
    );
  };

  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center">
        <label htmlFor="file-upload" className="cursor-pointer">
          <Avatar className="size-40 rounded-full transition-opacity hover:opacity-80">
            <AvatarImage loading="lazy" src={userDetails?.file?.url} />
            <AvatarFallback>
              {userDetails?.userName ? getInitials(userDetails.userName) : ""}
            </AvatarFallback>
          </Avatar>
          <FileUpload onSuccess={onFileUploadSuccess} />
        </label>
      </div>
      <div className="p-2">
        <div className="mb-2 max-w-sm">
          <p className="mb-1">Email</p>
          <div className="rounded-md border-[1px] px-3 py-[6px]">{userDetails?.email}</div>
        </div>
        <Form {...userNameForm}>
          <form onSubmit={userNameForm.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={userNameForm.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl className="mb-2 w-auto max-w-sm">
                    <Input className="w-96 max-w-sm" placeholder="Enter Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-20" disabled={updateUserMutation.isPending}>
              {updateUserMutation.isPending ? <LoadingSpinner /> : "Update"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Profile;
