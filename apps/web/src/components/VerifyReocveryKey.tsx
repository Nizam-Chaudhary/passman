import type { SubmitHandler } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { decrypt, deriveKey } from "@/lib/encryption.helper";
import { useStore } from "@/store/store";
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
import {
    verifyRecoveryKeyFormSchema,
    type VerifyRecoveryKeyForm,
} from "@/schema/user";
import { useGetUserDetails } from "@/services/queries/user";
import type { MasterKey } from "@passman/schema/api";
import { ROUTES } from "@/lib/constants";
import { useNavigate } from "react-router";

function VerifyRecoverKey() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const form = useForm({
        resolver: zodResolver(verifyRecoveryKeyFormSchema),
        defaultValues: {
            recoveryKey: "",
        },
    });

    const { setMastersetMasterKeyForRecovery } = useStore(
        useShallow((state) => ({
            setMastersetMasterKeyForRecovery: state.setMasterKeyForUpdate,
        }))
    );

    const { data: response, isPending, isError } = useGetUserDetails();
    const userDetails = response?.data;

    const verifyMasterPasswordMutation = useMutation({
        mutationFn: async (data: {
            recoveryKey: MasterKey;
            userRecoveryKey: string;
        }) => {
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

    const onSubmit: SubmitHandler<VerifyRecoveryKeyForm> = async (data) => {
        if (!userDetails || !userDetails.recoveryKey) {
            navigate(ROUTES.MASTER_PASSWORD.CREATE);
            return;
        }
        verifyMasterPasswordMutation.mutateAsync({
            recoveryKey: userDetails.recoveryKey,
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
