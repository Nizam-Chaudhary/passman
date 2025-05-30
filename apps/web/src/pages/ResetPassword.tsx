import type { ResetPasswordForm } from "@/types/auth";
import type { SubmitHandler } from "react-hook-form";
import { usePatchApiV1AuthResetPassword } from "@/api-client/api";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
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
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/hooks/use-toast";
import { ROUTES } from "@/lib/constants";
import { resetPasswordFormSchema } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";

function ResetPassword() {
    const form = useForm({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });
    const { toast } = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const resetPasswordMutation = usePatchApiV1AuthResetPassword();

    const onSubmit: SubmitHandler<ResetPasswordForm> = async (data) => {
        const token = searchParams.get("token");
        if (!token) {
            toast({
                title: "Invalid token signature! redirecting...",
                className: "bg-red-700",
            });

            navigate(ROUTES.LOGIN, { replace: true });
            return;
        }

        resetPasswordMutation.mutate(
            {
                data: {
                    token,
                    password: data.password,
                },
            },
            {
                onSuccess: () => {
                    toast({
                        title: "User login password updated successfully.",
                        className: "bg-green-700",
                    });

                    navigate(ROUTES.LOGIN, { replace: true });
                },
            }
        );
    };
    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Reset password</CardTitle>
                    <CardDescription>Send reset password email</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            className="space-y-4"
                            onSubmit={form.handleSubmit(onSubmit)}
                            autoComplete="off"
                        >
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                placeholder="Enter Password"
                                                {...field}
                                            />
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
                                            <PasswordInput
                                                placeholder="Enter Confirm Password"
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
                                disabled={resetPasswordMutation.isPending}
                            >
                                {resetPasswordMutation.isPending ? (
                                    <LoadingSpinner />
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

export default ResetPassword;
