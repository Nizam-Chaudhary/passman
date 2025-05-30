import type { SubmitHandler } from "react-hook-form";
import { usePostApiV1AuthResetPasswordMail } from "@/api-client/api";
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
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { ROUTES } from "@/lib/constants";
import { sendResetPassswordEmailFormSchema } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

function ResetPasswordSendMail() {
    const form = useForm({
        resolver: zodResolver(sendResetPassswordEmailFormSchema),
        defaultValues: {
            email: "",
        },
    });
    const { toast } = useToast();
    const navigate = useNavigate();

    const sendResetPasswordEmailMutation = usePostApiV1AuthResetPasswordMail();

    const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
        sendResetPasswordEmailMutation.mutate(
            { data },
            {
                onSuccess: () => {
                    toast({
                        title: "Reset link sent to registered email.",
                        className: "bg-green-700",
                    });

                    navigate(ROUTES.LOGIN, { replace: true });
                },
                onError: (error) => {
                    toast({
                        title: error.message,
                        className: "bg-red-700",
                    });
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
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter email"
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
                                disabled={
                                    sendResetPasswordEmailMutation.isPending
                                }
                            >
                                {sendResetPasswordEmailMutation.isPending ? (
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

export default ResetPasswordSendMail;
