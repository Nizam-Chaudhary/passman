import type { RegisterUserBody } from "@passman/schema/api/user";
import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserBodySchema } from "@passman/schema/api/user";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/react/shallow";

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
import LoadingSpinner from "@/components/ui/loading-spinner";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/hooks/use-toast";
import { useRegisterUser } from "@/services/mutations/user";
import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/_onboard/signup")({
  component: SignUp,
});

function SignUp() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const registerUserMutation = useRegisterUser();

  const { authActions } = useAuthStore(
    useShallow((state) => ({
      authActions: state.actions,
    })),
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
      onSuccess: async (_response, variables) => {
        toast({
          className: "bg-green-700",
          title: "Signed up successfully!",
        });
        authActions.setUserEmail(variables.email);
        authActions.setIsEmailVerified(false);
        await navigate({ to: "/verify-account" });
      },
    });
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...signUpForm}>
            <form onSubmit={signUpForm.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={signUpForm.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Username" {...field} />
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
                      <Input placeholder="Enter Email" type="email" {...field} />
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
                      <PasswordInput placeholder="Enter Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-20" disabled={registerUserMutation.isPending}>
                {registerUserMutation.isPending ? <LoadingSpinner /> : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Link to="/login" className="text-blue-600" replace={true}>
            Already have an account? Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
