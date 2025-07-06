import type { VerifyMasterPasswordBody } from "@passman/schema/api/user";
import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { verifyMasterPasswordBodySchema } from "@passman/schema/api/user";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
import LoadingSpinner from "@/components/ui/loading-spinner";
import { PasswordInput } from "@/components/ui/password-input";
import { useRefreshToken } from "@/hooks/refresh-token";
import { useToast } from "@/hooks/use-toast";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const { toast } = useToast();

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
    setIsSubmitting(true);
    await verifyMasterPasswordMutation.mutateAsync(data, {
      onSuccess: async (response) => {
        if (!response.data.masterKey) {
          navigate({ to: "/master-password/create", replace: true });
          return;
        }
        const userKey = await deriveKey(data.masterPassword, response.data.masterKey.salt);

        setIsSubmitting(false);
        const decryptedMasterKey = await decrypt(response.data.masterKey, userKey);
        const masterKey = await importKey(decryptedMasterKey);
        setMasterkey(masterKey);
        authActions.authenticate();
        navigate({ to: "/", replace: true });
      },
      onError: (error) => {
        setIsSubmitting(false);
        toast({
          title: error.message,
          className: "bg-red-700",
        });
        if (error.message === "Access token expired") {
          refreshTokenMutation.mutate();
        }
      },
    });
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Master Password</CardTitle>
          <CardDescription>Enter existing Master password</CardDescription>
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
              <Button type="submit" className="w-20" disabled={isSubmitting}>
                {isSubmitting ? <LoadingSpinner /> : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Link
            className="text-blue-600"
            to="/master-password/reset/$type"
            params={{
              type: "recover",
            }}
          >
            Forgot master password
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
