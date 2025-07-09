import type { RegisterUserBody } from "@passman/schema/api/user";
import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserBodySchema } from "@passman/schema/api/user";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { LoadingSwap } from "@/components/ui/loading-swap";
import { PasswordInput } from "@/components/ui/password-input";
import { useRegisterUser } from "@/services/mutations/user";
import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/_onboard/signup")({
  component: SignUp,
});

function SignUp() {
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
    toast.promise(
      new Promise((resolve, reject) => {
        registerUserMutation.mutate(data, {
          onError: (error) => {
            reject(error);
          },
          onSuccess: async (_response, variables) => {
            authActions.setUserEmail(variables.email);
            authActions.setIsEmailVerified(false);
            await navigate({ to: "/verify-account" });
            resolve("Signed up successfully!");
          },
        });
      }),
      {
        loading: "Signing up...",
        success: "Signed up successfully!",
        error: (error) => error.message || "Sign up failed.",
      },
    );
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">Sign Up for Passman</CardTitle>
          <CardDescription className="text-center">
            Create your secure Passman account
          </CardDescription>
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
              <Button type="submit" className="w-full" disabled={registerUserMutation.isPending}>
                <LoadingSwap isLoading={registerUserMutation.isPending}>Sign Up</LoadingSwap>
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-gray-400">Or</span>
            </div>
          </div>
          <Link to="/login" className="text-sm text-white">
            Already have an account? Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
