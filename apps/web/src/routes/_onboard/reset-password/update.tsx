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
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/hooks/use-toast";
import { resetPasswordFormSchema, type ResetPasswordForm } from "@/schema/user";
import { useResetPassword } from "@/services/mutations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import z from "zod/v4";

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
    const { toast } = useToast();
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
                    toast({
                        title: "User login password updated successfully.",
                        className: "bg-green-700",
                    });

                    navigate({ to: "/login", replace: true });
                },
            }
        );
    };
    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Reset account password</CardTitle>
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
