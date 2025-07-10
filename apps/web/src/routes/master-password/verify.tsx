import type { VerifyMasterPasswordBody } from "@passman/schema/api/user";
import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { verifyMasterPasswordBodySchema } from "@passman/schema/api/user";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
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
import { LoadingSwap } from "@/components/ui/loading-swap";
import { PasswordInput } from "@/components/ui/password-input";
import { useRefreshToken } from "@/hooks/refresh-token";
import { decrypt, deriveKey, importKey } from "@/lib/encryption-helper";
import { useVerifyMasterPassword } from "@/services/mutations/user";
import { useStore } from "@/stores";
import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/master-password/verify")({
  beforeLoad: () => {
    const { isLoggedIn, isMasterPasswordCreated, isAuthenticated } = useAuthStore.getState();
    if (!isLoggedIn) {
      throw redirect({
        to: "/login",
      });
    } else if (!isMasterPasswordCreated) {
      throw redirect({
        to: "/master-password/create",
      });
    } else if (isAuthenticated) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: VerifyMasterPassword,
});

function VerifyMasterPassword() {
  const { setMasterkey } = useStore(
    useShallow((state) => ({
      setMasterkey: state.setMasterKey,
    })),
  );
  const { authActions } = useAuthStore(
    useShallow((state) => ({
      authActions: state.actions,
    })),
  );

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(verifyMasterPasswordBodySchema),
    defaultValues: {
      masterPassword: "",
    },
  });

  const verifyMasterPasswordMutation = useVerifyMasterPassword();
  const refreshTokenMutation = useRefreshToken();

  const onSubmit: SubmitHandler<VerifyMasterPasswordBody> = async (data, event) => {
    event?.preventDefault();
    toast.promise(
      verifyMasterPasswordMutation.mutateAsync(data, {
        onSuccess: async (response) => {
          if (!response.data.masterKey) {
            navigate({ to: "/master-password/create", replace: true });
            throw new Error("Master password not found. Please create one.");
          }
          await refreshTokenMutation.mutate();

          console.log("Nizam@6353");
          const userKey = await deriveKey(data.masterPassword, response.data.masterKey.salt);
          const decryptedMasterKey = await decrypt(response.data.masterKey, userKey);
          const masterKey = await importKey(decryptedMasterKey);
          setMasterkey(masterKey);
          authActions.authenticate();
          navigate({ to: "/", replace: true });
        },
        onError: async (error) => {
          if (error.message === "Access token expired") {
            await refreshTokenMutation.mutate();
          }
          throw error;
        },
      }),
      {
        loading: "Verifying master password...",
        success: "Master password verified successfully!",
        error: (error) => error.message || "Master password verification failed.",
      },
    );
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">Verify Master Password</CardTitle>
          <CardDescription className="text-center">
            Enter your master password to unlock Passman.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="masterPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Master Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Enter Master Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={verifyMasterPasswordMutation.isPending}
              >
                <LoadingSwap isLoading={verifyMasterPasswordMutation.isPending}>Submit</LoadingSwap>
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4">
          <Link
            className="text-sm text-white"
            to="/master-password/reset/$type"
            params={{
              type: "recover",
            }}
          >
            Forgot master password
          </Link>
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-gray-400">Or</span>
            </div>
          </div>
          <Button
            variant="link"
            className="text-sm text-white"
            onClick={() => {
              authActions.logout();
              navigate({ to: "/login", replace: true });
            }}
          >
            Back to login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
