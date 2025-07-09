import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod/v4";

import type { ResetPasswordForm } from "@/schema/user";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { PasswordInput } from "@/components/ui/password-input";
import { resetPasswordFormSchema } from "@/schema/user";
import { useResetPassword } from "@/services/mutations/user";

const resetPasswordSearchSchema = z.object({
  token: z.jwt(),
});

export const Route = createFileRoute("/_onboard/reset-password/update")({
  component: ResetPassword,
  validateSearch: zodValidator(resetPasswordSearchSchema),
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

    resetPasswordMutation.mutate(
      {
        token,
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success("User login password updated successfully.");

          navigate({ to: "/login", replace: true });
        },
      },
    );
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset account password</CardTitle>
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
              <Button type="submit" className="w-20" disabled={resetPasswordMutation.isPending}>
                {resetPasswordMutation.isPending ? <LoadingSpinner /> : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
