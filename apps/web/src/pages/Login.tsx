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
import { setRefreshToken, setToken } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { useStore } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { PasswordInput } from "../components/ui/password-input";
import { useLoginUser } from "@/services/mutations/auth";
import type { LoginUserBody } from "@passman/schema/api/auth";
import { loginUserBodySchema } from "@passman/schema/api/auth";

export default function Login() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const mutateLoginUser = useLoginUser();

    const { setUserEmail, setIsEmailVerified } = useStore(
        useShallow((state) => ({
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
        console.log("data", data);
        mutateLoginUser.mutate(data, {
            onError: (error, variables) => {
                if (
                    error.message == "Email not verified. Please verify first!"
                ) {
                    setIsEmailVerified(false);
                    setUserEmail(variables.email);
                    navigate(ROUTES.VERIFY_ACCOUNT);
                } else {
                    toast({
                        className: "bg-red-700",
                        title: error?.message,
                    });
                }
            },
            onSuccess: async (response, variables) => {
                setToken(response.data.token);
                setRefreshToken(response.data.refreshToken);
                setIsEmailVerified(true);
                toast({
                    className: "bg-green-700",
                    title: "Logged in successfully",
                });
                if (response.data.masterKey == null) {
                    navigate(ROUTES.MASTER_PASSWORD.CREATE);
                } else if (response.data.isVerified) {
                    navigate(ROUTES.MASTER_PASSWORD.VERIFY);
                } else {
                    setUserEmail(variables.email);
                    navigate(ROUTES.VERIFY_ACCOUNT);
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
                                <NavLink
                                    to={ROUTES.RESET_PASSWORD.EMAIL}
                                    className="text-blue-600"
                                >
                                    Forgot password
                                </NavLink>
                            </div>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <NavLink to={ROUTES.SIGN_UP} className="text-blue-600">
                        Create a new account
                    </NavLink>
                </CardFooter>
            </Card>
        </div>
    );
}
