import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import type { VerifyUserEmailForm } from "@/schema/user";

import Timer from "@/components/timer";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { verifyUserEmailFormSchema } from "@/schema/user";
import { useSendVerificationOtp, useVerifyUserEmail } from "@/services/mutations/user";
import { useStore } from "@/stores";
import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/_onboard/verify-account")({
  component: VerifyAccount,
});

function VerifyAccount() {
  const { timer, decreaseTimer, setTimer } = useStore(
    useShallow((store) => ({
      timer: store.otpTimer,
      decreaseTimer: store.decreaseOtpTimer,
      setTimer: store.setOtpTimer,
    })),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      decreaseTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [decreaseTimer]);

  const form = useForm<VerifyUserEmailForm>({
    resolver: zodResolver(verifyUserEmailFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { email } = useAuthStore(
    useShallow((state) => ({
      authActions: state.actions,
      email: state.userEmail,
    })),
  );

  const resendOTPMutation = useSendVerificationOtp();
  useEffect(() => {
    if (email && timer <= 0) {
      resendOTPMutation.mutate({ email });
      setTimer(120); // Reset timer immediately after resending OTP
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, timer]);

  useEffect(() => {
    setTimer(120);
  }, []);

  const verifyUserEmailMutation = useVerifyUserEmail();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<VerifyUserEmailForm> = (data) => {
    const payload = {
      email: email!,
      otp: data.otp,
    };
    toast.promise(
      new Promise((resolve, reject) => {
        verifyUserEmailMutation.mutate(payload, {
          onError: (error) => {
            reject(error);
          },
          onSuccess: () => {
            navigate({ to: "/login", replace: true });
            resolve("Email verified successfully");
          },
        });
      }),
      {
        loading: "Verifying account...",
        success: "Account verified successfully!",
        error: (error) => error.message || "Account verification failed.",
      },
    );
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">Verify your account</CardTitle>
          <CardDescription className="text-center">
            Please enter the one-time password sent to your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-xs space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={verifyUserEmailMutation.isPending}>
                <LoadingSwap isLoading={verifyUserEmailMutation.isPending}>Submit</LoadingSwap>
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4">
          {timer > 0 ? (
            <Timer text="Resend OTP again in " time={timer} />
          ) : (
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toast.promise(
                  new Promise((resolve, reject) => {
                    if (email) {
                      resendOTPMutation.mutate(
                        { email },
                        {
                          onSuccess: () => {
                            setTimer(120);
                            resolve("OTP sent successfully!");
                          },
                          onError: (error) => {
                            reject(error);
                          },
                        },
                      );
                    } else {
                      reject(new Error("Email not found."));
                    }
                  }),
                  {
                    loading: "Sending OTP...",
                    success: "OTP sent successfully!",
                    error: (error) => error.message || "Failed to send OTP.",
                  },
                );
              }}
              disabled={resendOTPMutation.isPending}
            >
              <LoadingSwap isLoading={resendOTPMutation.isPending}>Resend OTP</LoadingSwap>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
