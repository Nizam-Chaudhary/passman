import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import type { UpdateMasterPasswordForm } from "@/schema/user";

import RecoveryKeyDialog from "@/components/recover-key-dialog";
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
import LoadingSpinner from "@/components/ui/loading-spinner";
import { PasswordInput } from "@/components/ui/password-input";
import VerifyRecoveryMasterPassword from "@/components/verify-recovery-master-password";
import VerifyRecoverKey from "@/components/verify-reocvery-key";
import { useRefreshToken } from "@/hooks/refresh-token";
import { deriveKey, encrypt, generateRecoveryKey, generateSalt } from "@/lib/encryption-helper";
import { updateMasterPasswordFormSchema } from "@/schema/user";
import { useUpdateMasterPassword } from "@/services/mutations/user";
import { useStore } from "@/stores";
import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/master-password/reset/$type")({
  beforeLoad: () => {
    const { isLoggedIn, isMasterPasswordCreated } = useAuthStore.getState();
    if (!isLoggedIn) {
      throw redirect({
        to: "/login",
      });
    } else if (!isMasterPasswordCreated) {
      throw redirect({
        to: "/master-password/create",
      });
    }
  },
  component: ResetMasterPassword,
});

function ResetMasterPassword() {
  const { type } = Route.useParams();
  const { masterKeyForUpdate, setMasterKeyForUpdate, setRecoveryKey, setOpenRecoveryKeyDialog } =
    useStore(
      useShallow((state) => ({
        masterKeyForUpdate: state.masterKeyForUpdate,
        setRecoveryKey: state.setRecoveryKey,
        setOpenRecoveryKeyDialog: state.setOpenRecoveryKeyDialog,
        setMasterKeyForUpdate: state.setMasterKeyForUpdate,
      })),
    );

  const form = useForm({
    resolver: zodResolver(updateMasterPasswordFormSchema),
    defaultValues: {
      masterPassword: "",
      confirmMasterPassword: "",
    },
  });

  const updateMasterPasswordMutation = useUpdateMasterPassword();
  const refreshTokenMutation = useRefreshToken();

  const updateMasterPassword: SubmitHandler<UpdateMasterPasswordForm> = async (data) => {
    if (!masterKeyForUpdate) {
      toast.error("Please verify first");

      return;
    }

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
    const encryptedMasterKeyPromise = encrypt(masterKeyForUpdate, derivedUserKey);
    const encryptedRecoveryKeyPromise = encrypt(masterKeyForUpdate, derivedRecoveryKey);

    const [encryptedMasterKey, encryptedRecoveryKey] = await Promise.all([
      encryptedMasterKeyPromise,
      encryptedRecoveryKeyPromise,
    ]);

    await updateMasterPasswordMutation.mutateAsync(
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
          setMasterKeyForUpdate(null);
          setOpenRecoveryKeyDialog(true);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Master Password</CardTitle>
          <CardDescription>
            {type === "recover" ? "Recover" : "Update"} master password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!masterKeyForUpdate ? (
            type === "update" ? (
              <VerifyRecoveryMasterPassword />
            ) : (
              <VerifyRecoverKey />
            )
          ) : null}
          {masterKeyForUpdate ? (
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(updateMasterPassword)}
                autoComplete="off"
              >
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
                  disabled={updateMasterPasswordMutation.isPending}
                >
                  {updateMasterPasswordMutation.isPending ? <LoadingSpinner /> : "Submit"}
                </Button>
              </form>
            </Form>
          ) : null}
        </CardContent>
      </Card>
      <RecoveryKeyDialog />
    </div>
  );
}

export default ResetMasterPassword;
