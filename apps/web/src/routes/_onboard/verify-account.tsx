import Timer from "@/components/Timer";
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
import { useToast } from "@/hooks/use-toast";
import {
    verifyUserEmailFormSchema,
    type VerifyUserEmailForm,
} from "@/schema/user";
import {
    useSendVerificationOtp,
    useVerifyUserEmail,
} from "@/services/mutations/user";
import { useStore } from "@/stores";
import { useAuthStore } from "@/stores/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/react/shallow";

export const Route = createFileRoute("/_onboard/verify-account")({
    component: VerifyAccount,
});

function VerifyAccount() {
    const { timer, decreaseTimer, setTimer } = useStore(
        useShallow((store) => ({
            timer: store.otpTimer,
            decreaseTimer: store.decreaseOtpTimer,
            setTimer: store.setOtpTimer,
        }))
    );

    useEffect(() => {
        const interval = setInterval(() => {
            decreaseTimer();
        }, 1000);

        return () => clearInterval(interval);
    }, [decreaseTimer]);

    const { toast } = useToast();
    const form = useForm<VerifyUserEmailForm>({
        resolver: zodResolver(verifyUserEmailFormSchema),
        defaultValues: {
            otp: "",
        },
    });

    const { email } = useAuthStore(
        useShallow((state) => ({
            email: state.userEmail,
        }))
    );

    const resendOTPMutation = useSendVerificationOtp();
    useEffect(() => {
        if (email && timer <= 0) {
            resendOTPMutation.mutate({ email });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email]);

    const verifyUserEmailMutation = useVerifyUserEmail();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<VerifyUserEmailForm> = (data) => {
        const payload = {
            email: email!,
            otp: data.otp,
        };
        verifyUserEmailMutation.mutate(payload, {
            onError: (error) => {
                toast({
                    className: "bg-red-700 text-white",
                    title: error.message,
                });
            },
            onSuccess: () => {
                toast({
                    className: "bg-green-700 text-white",
                    title: "Email verified successfully",
                });
                navigate({ to: "/login", replace: true });
            },
        });
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Verify Account</CardTitle>
                    <CardDescription>
                        Please enter the one-time password sent to your Email.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="w-2/3 space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="otp"
                                render={({ field }) => (
                                    <FormItem>
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
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    {timer > 0 ? (
                        <Timer text="Resend OTP again in " time={timer} />
                    ) : (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (email) {
                                    resendOTPMutation.mutate({
                                        email,
                                    });
                                }
                                setTimer(120);
                            }}
                        >
                            Resend OTP
                        </button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
