import type { UserDetails, VerifyRecoverKeyFormData } from "@/types/auth";
import type { SubmitHandler } from "react-hook-form";
import { useGetApiV1Users } from "@/api-client/api";
import { useToast } from "@/hooks/use-toast";
import { decrypt, deriveKey } from "@/lib/encryption.helper";
import { useStore } from "@/store/store";
import { verifyRecoverKeyFormSchema } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import LoadingSpinner from "./ui/loadingSpinner";
import { PasswordInput } from "./ui/password-input";

function VerifyRecoverKey() {
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(verifyRecoverKeyFormSchema),
        defaultValues: {
            recoveryKey: "",
        },
    });

    const { setMastersetMasterKeyForRecovery } = useStore(
        useShallow((state) => ({
            setMastersetMasterKeyForRecovery: state.setMasterKeyForUpdate,
        }))
    );

    const { data: response, isPending, isError } = useGetApiV1Users();
    const userDetails = response?.data;

    const verifyMasterPasswordMutation = useMutation({
        mutationFn: async (data: UserDetails & { userRecoveryKey: string }) => {
            const derivedRecoveryDecryptKey = await deriveKey(
                data.userRecoveryKey,
                data.recoveryKey.salt
            );

            return await decrypt(data.recoveryKey, derivedRecoveryDecryptKey);
        },
        onSuccess: (masterKey) => {
            toast({
                className: "bg-green-700 text-white",
                title: "Recover key verified successfully",
            });

            setMastersetMasterKeyForRecovery(masterKey);
        },
        onError: () => {
            setMastersetMasterKeyForRecovery(null);
            toast({
                className: "bg-red-700 text-white",
                title: "Invalid recovery key",
            });
        },
    });

    const onSubmit: SubmitHandler<VerifyRecoverKeyFormData> = async (data) => {
        verifyMasterPasswordMutation.mutateAsync({
            ...userDetails!,
            userRecoveryKey: data.recoveryKey,
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
            <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
                autoComplete="off"
            >
                <FormField
                    control={form.control}
                    name="recoveryKey"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Recovery key</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="Enter Recovery key"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-20" disabled={isPending}>
                    {isPending ? <LoadingSpinner /> : "Submit"}
                </Button>
            </form>
        </Form>
    );
}

export default VerifyRecoverKey;
