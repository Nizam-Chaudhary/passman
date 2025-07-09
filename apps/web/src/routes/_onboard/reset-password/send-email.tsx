import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { sendResetPasswordEmailBodySchema } from "@passman/schema/api";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { useSendResetPasswordMail } from "@/services/mutations/user";

export const Route = createFileRoute("/_onboard/reset-password/send-email")({
  component: ResetPasswordSendMail,
});

function ResetPasswordSendMail() {
  const form = useForm({
    resolver: zodResolver(sendResetPasswordEmailBodySchema),
    defaultValues: {
      email: "",
    },
  });
  const navigate = useNavigate();

  const sendResetPasswordEmailMutation = useSendResetPasswordMail();

  const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
    toast.promise(
      new Promise((resolve, reject) => {
        sendResetPasswordEmailMutation.mutate(data, {
          onSuccess: () => {
            navigate({ to: "/login", replace: true });
            resolve("Reset link sent to registered email.");
          },
          onError: (error) => {
            reject(error);
          },
        });
      }),
      {
        loading: "Sending reset link...",
        success: "Reset link sent to registered email.",
        error: (error) => error.message || "Failed to send reset link.",
      },
    );
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">Forgot your password?</CardTitle>
          <CardDescription className="text-center">
            Enter your email below to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={sendResetPasswordEmailMutation.isPending}
              >
                <LoadingSwap isLoading={sendResetPasswordEmailMutation.isPending}>
                  Submit
                </LoadingSwap>
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
