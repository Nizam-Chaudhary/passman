import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod/v4";

import type { ResetPasswordForm } from "@/schema/user";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { PasswordInput } from "@/components/ui/password-input";
import { resetPasswordFormSchema } from "@/schema/user";
import { useResetPassword } from "@/services/mutations/user";

const resetPasswordSearchSchema = z.object({
  token: z.jwt(),
});

export const Route = createFileRoute("/_onboard/reset-password/update")({
  component: ResetPassword,
  validateSearch: resetPasswordSearchSchema,
});

function ResetPassword() {
  const form = useForm({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const navigate = useNavigate();
  const { token } = Route.useSearch();

  const resetPasswordMutation = useResetPassword();

  const onSubmit: SubmitHandler<ResetPasswordForm> = async (data) => {
    if (!token) {
      navigate({ to: "/login", replace: true });
      return;
    }

    toast.promise(
      new Promise((resolve, reject) => {
        resetPasswordMutation.mutate(
          {
            token,
            password: data.password,
          },
          {
            onSuccess: () => {
              navigate({ to: "/login", replace: true });
              resolve("User login password updated successfully.");
            },
            onError: (error) => {
              reject(error);
            },
          },
        );
      }),
      {
        loading: "Resetting password...",
        success: "Password reset successfully!",
        error: (error) => error.message || "Password reset failed.",
      },
    );
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">Reset your password</CardTitle>
          <CardDescription className="text-center">Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Enter Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Enter Confirm Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={resetPasswordMutation.isPending}>
                <LoadingSwap isLoading={resetPasswordMutation.isPending}>Submit</LoadingSwap>
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4">
          <Link to="/login" className="text-sm text-white">
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
