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
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { useLoginUser } from "@/services/mutations/auth";
import { useAuthStore } from "@/stores/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import type { JwtUserData, LoginUserBody } from "@passman/schema/api/auth";
import { loginUserBodySchema } from "@passman/schema/api/auth";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { jwtDecode } from "jwt-decode";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/react/shallow";
import { PasswordInput } from "../../components/ui/password-input";

export const Route = createFileRoute("/_onboard/login")({
    component: Login,
});

function Login() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const mutateLoginUser = useLoginUser();

    const { login, setIsEmailVerified, setUserEmail } = useAuthStore(
        useShallow((state) => ({
            login: state.login,
            setIsEmailVerified: state.setIsEmailVerified,
            setUserEmail: state.setUserEmail,
        }))
    );

    const loginForm = useForm<LoginUserBody>({
        resolver: zodResolver(loginUserBodySchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(data: LoginUserBody) {
        mutateLoginUser.mutate(data, {
            onError: (error) => {
                if (
                    error.message == "Email not verified. Please verify first!"
                ) {
                    setIsEmailVerified(false);
                    setUserEmail(data.email);
                    navigate({ to: "/verify-account" });
                } else {
                    toast({
                        className: "bg-red-700",
                        title: error?.message,
                    });
                }
            },
            onSuccess: async (response, variables) => {
                setIsEmailVerified(true);
                const token = response.data.token;
                const userData = jwtDecode<JwtUserData>(token);
                login({
                    accessToken: token,
                    refreshToken: response.data.refreshToken,
                    isEmailVerified: true,
                    user: userData,
                });
                toast({
                    className: "bg-green-700",
                    title: "Logged in successfully",
                });
                if (response.data.masterKey == null) {
                    navigate({ to: "/master-password/create" });
                } else if (response.data.isVerified) {
                    navigate({ to: "/master-password/verify" });
                } else {
                    setUserEmail(variables.email);
                    navigate({ to: "/verify-account" });
                }
            },
        });
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...loginForm}>
                        <form
                            onSubmit={loginForm.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={loginForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter Email"
                                                type="email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={loginForm.control}
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
                            <div className="flex justify-between items-center">
                                <Button
                                    type="submit"
                                    className="w-18"
                                    disabled={mutateLoginUser.isPending}
                                >
                                    {mutateLoginUser.isPending ? (
                                        <LoadingSpinner />
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                                <Link
                                    to={"/reset-password/send-email"}
                                    className="text-blue-600"
                                >
                                    Forgot password
                                </Link>
                            </div>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <Link to="/signup" className="text-blue-600">
                        Create a new account
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
