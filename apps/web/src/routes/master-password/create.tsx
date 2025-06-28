import type { SubmitHandler } from "react-hook-form";
import type { CreateMasterPasswordForm } from "@/schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/react/shallow";
import RecoveryKeyDialog from "@/components/RecoverKeyDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useRefreshToken } from "@/hooks/refresh-token";
import { useToast } from "@/hooks/use-toast";
import {
  deriveKey,
  encrypt,
  generateMasterKey,
  generateRecoveryKey,
  generateSalt,
} from "@/lib/encryption.helper";
import { createMasterPasswordFormSchema } from "@/schema/user";
import { useCreateMasterPassword } from "@/services/mutations/user";
import { useStore } from "@/stores";
import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/master-password/create")({
  beforeLoad: () => {
    const isLoggedIn = useAuthStore.getState().isLoggedIn;

    if (!isLoggedIn) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: CreateMasterPassword,
});

function CreateMasterPassword() {
  const { setOpenRecoveryKeyDialog, setRecoveryKey } = useStore(
    useShallow((state) => ({
      setRecoveryKey: state.setRecoveryKey,
      setOpenRecoveryKeyDialog: state.setOpenRecoveryKeyDialog,
    }))
  );

  const { authActions } = useAuthStore(
    useShallow((state) => ({
      authActions: state.actions,
    }))
  );

  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(createMasterPasswordFormSchema),
    defaultValues: {
      masterPassword: "",
      confirmMasterPassword: "",
    },
  });

  const createMasterPasswordMutation = useCreateMasterPassword();
  const refreshTokenMutation = useRefreshToken();

  const onSubmit: SubmitHandler<CreateMasterPasswordForm> = async (data) => {
    const masterKey = generateMasterKey();
    const recoveryKey = generateRecoveryKey();
    setRecoveryKey(recoveryKey);

    /* derive user key from master password and recover key using generated recovery key */
    const userKeySalt = generateSalt();
    const recoveryKeySalt = generateSalt();
    const derivedUserKeyPromise = deriveKey(data.masterPassword, userKeySalt);
    const derivedRecoveryKeyPromise = deriveKey(recoveryKey, recoveryKeySalt);
    const [derivedUserKey, derivedRecoveryKey] = await Promise.all([
      derivedUserKeyPromise,
      derivedRecoveryKeyPromise,
    ]);

    /* encrypt the master key with both user key and recovery key */
    const encryptedMasterKeyPromise = encrypt(masterKey, derivedUserKey);
    const encryptedRecoveryKeyPromise = encrypt(masterKey, derivedRecoveryKey);

    const [encryptedMasterKey, encryptedRecoveryKey] = await Promise.all([
      encryptedMasterKeyPromise,
      encryptedRecoveryKeyPromise,
    ]);

    await createMasterPasswordMutation.mutateAsync(
      {
        masterPassword: data.masterPassword,
        masterKey: { ...encryptedMasterKey, salt: userKeySalt },
        recoveryKey: {
          ...encryptedRecoveryKey,
          salt: recoveryKeySalt,
        },
      },
      {
        onSuccess: async () => {
          await refreshTokenMutation.mutate();
          authActions.setMasterPasswordCreated(true);
          setOpenRecoveryKeyDialog(true);
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
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Master Password</CardTitle>
          <CardDescription>Create a master password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
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
              <FormField
                control={form.control}
                name="confirmMasterPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Master Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Enter Confirm Master Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-20"
                disabled={createMasterPasswordMutation.isPending}
              >
                {createMasterPasswordMutation.isPending ? <LoadingSpinner /> : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <RecoveryKeyDialog />
    </div>
  );
}
