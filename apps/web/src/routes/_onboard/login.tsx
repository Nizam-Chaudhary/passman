import type { JwtUserData, LoginUserBody } from "@passman/schema/api/auth";

import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserBodySchema } from "@passman/schema/api/auth";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { jwtDecode } from "jwt-decode";
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
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useLoginUser } from "@/services/mutations/auth";
import { useAuthStore } from "@/stores/auth";

import { PasswordInput } from "../../components/ui/password-input";

export const Route = createFileRoute("/_onboard/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const mutateLoginUser = useLoginUser();

  const { authActions } = useAuthStore(
    useShallow((state) => ({
      authActions: state.actions,
    })),
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
        if (error.message === "Email not verified. Please verify first!") {
          authActions.setIsEmailVerified(false);
          authActions.setUserEmail(data.email);
          navigate({ to: "/verify-account" });
        } else {
          toast.error(error?.message);
        }
      },
      onSuccess: async (response, variables) => {
        authActions.setIsEmailVerified(true);
        const token = response.data.token;
        const userData = jwtDecode<JwtUserData>(token);
        authActions.login({
          accessToken: token,
          refreshToken: response.data.refreshToken,
          isEmailVerified: true,
          user: userData,
        });
        toast.success("Logged in successfully");
        if (response.data.masterKey == null) {
          navigate({ to: "/master-password/create" });
        } else if (response.data.isVerified) {
          navigate({ to: "/master-password/verify" });
        } else {
          authActions.setUserEmail(variables.email);
          navigate({ to: "/verify-account" });
        }
      },
    });
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">Login to Passman</CardTitle>
          <CardDescription className="text-center">Your secure password manager</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
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
                control={loginForm.control}
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
              <Button type="submit" className="w-full" disabled={mutateLoginUser.isPending}>
                {mutateLoginUser.isPending ? <LoadingSpinner /> : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4">
          <Link to="/reset-password/send-email" className="text-sm text-white">
            Forgot password?
          </Link>
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-gray-400">Or</span>
            </div>
          </div>
          <Link to="/signup" className="text-sm text-white">
            Create a new account
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
