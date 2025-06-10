import type { SubmitHandler } from "react-hook-form";
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
import { ROUTES } from "@/lib/constants";
import { useStore } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { PasswordInput } from "../components/ui/password-input";
import {
    registerUserBodySchema,
    type RegisterUserBody,
} from "@passman/schema/api/user";
import { useRegisterUser } from "@/services/mutations/user";

export default function SignUp() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const registerUserMutation = useRegisterUser();

    const { setUserEmail, setIsEmailVerified } = useStore(
        useShallow((state) => ({
            setUserEmail: state.setUserEmail,
            setIsEmailVerified: state.setIsEmailVerified,
        }))
    );

    const signUpForm = useForm<RegisterUserBody>({
        resolver: zodResolver(registerUserBodySchema),
        defaultValues: {
            userName: "",
            email: "",
            password: "",
        },
    });

    const onSubmit: SubmitHandler<RegisterUserBody> = async (data) => {
        registerUserMutation.mutate(data, {
            onError: (error) => {
                toast({
                    className: "bg-red-700",
                    title: error.message,
                });
            },
            onSuccess: async (response, variables) => {
                toast({
                    className: "bg-green-700",
                    title: "Signed up successfully!",
                });
                console.log("response", response);
                setUserEmail(variables.email);
                setIsEmailVerified(false);
                await navigate(ROUTES.VERIFY_ACCOUNT);
            },
        });
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>Create a new account</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...signUpForm}>
                        <form
                            onSubmit={signUpForm.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={signUpForm.control}
                                name="userName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter Username"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={signUpForm.control}
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
                                control={signUpForm.control}
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
                            <Button
                                type="submit"
                                className="w-20"
                                disabled={registerUserMutation.isPending}
                            >
                                {registerUserMutation.isPending ? (
                                    <LoadingSpinner />
                                ) : (
                                    "Sign Up"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <NavLink
                        to={ROUTES.LOGIN}
                        className="text-blue-600"
                        replace
                    >
                        Already have an account? Login
                    </NavLink>
                </CardFooter>
            </Card>
        </div>
    );
}
