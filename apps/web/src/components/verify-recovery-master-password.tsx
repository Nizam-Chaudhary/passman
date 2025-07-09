import type { MasterKey, VerifyMasterPasswordBody } from "@passman/schema/api";
import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { verifyMasterPasswordBodySchema } from "@passman/schema/api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import { decrypt, deriveKey } from "@/lib/encryption-helper";
import { useGetUserDetails } from "@/services/queries/user";
import { useStore } from "@/stores";

import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import LoadingSpinner from "./ui/loading-spinner";
import { PasswordInput } from "./ui/password-input";

function VerifyRecoveryMasterPassword() {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(verifyMasterPasswordBodySchema),
    defaultValues: {
      masterPassword: "",
    },
  });

  const { setMastersetMasterKeyForRecovery } = useStore(
    useShallow((state) => ({
      setMastersetMasterKeyForRecovery: state.setMasterKeyForUpdate,
    })),
  );

  const { data: response, isPending, isError } = useGetUserDetails();
  const userDetails = response?.data;

  const verifyMasterPasswordMutation = useMutation({
    mutationFn: async (data: { masterPassword: string; masterKey: MasterKey }) => {
      const derivedUsedKey = await deriveKey(data.masterPassword, data.masterKey.salt);

      return await decrypt(data.masterKey, derivedUsedKey);
    },
    onSuccess: (masterKey) => {
      toast.success("Master password verified successfully");

      setMastersetMasterKeyForRecovery(masterKey);
    },
    onError: () => {
      setMastersetMasterKeyForRecovery(null);
      toast.error("Invalid master password");
    },
  });

  const onSubmit: SubmitHandler<VerifyMasterPasswordBody> = (data) => {
    if (!userDetails || !userDetails.masterKey) {
      navigate({ to: "/master-password/verify" });
      return;
    }
    verifyMasterPasswordMutation.mutate({
      masterKey: userDetails.masterKey,
      masterPassword: data.masterPassword,
    });
  };

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
        <FormField
          control={form.control}
          name="masterPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Master Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Enter Existing Master Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-20" disabled={verifyMasterPasswordMutation.isPending}>
          {verifyMasterPasswordMutation.isPending ? <LoadingSpinner /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

export default VerifyRecoveryMasterPassword;
