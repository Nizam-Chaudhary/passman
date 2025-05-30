import type { CreateMasterPasswordFormData } from "@/types/auth";
import type { SubmitHandler } from "react-hook-form";
import { usePatchApiV1AuthCreateMasterKey } from "@/api-client/api";
import RecoveryKeyDialog from "@/components/RecoverKeyDialog";
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
import { useStore } from "@/store/store";
import { createMasterPasswordFormSchema } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/react/shallow";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../components/ui/form";

export default function CreateMasterPassword() {
    const { setOpenRecoveryKeyDialog, setRecoveryKey } = useStore(
        useShallow((state) => ({
            setOpenRecoveryKeyDialog: state.setOpenRecoveryKeyDialog,
            setRecoveryKey: state.setRecoveryKey,
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

    const createMasterPasswordMutation = usePatchApiV1AuthCreateMasterKey();
    const refreshTokenMutation = useRefreshToken();

    const onSubmit: SubmitHandler<CreateMasterPasswordFormData> = async (
        data
    ) => {
        const masterKey = generateMasterKey();
        const recoveryKey = generateRecoveryKey();
        setRecoveryKey(recoveryKey);

        /* derive user key from master password and recover key using generated recovery key */
        const userKeySalt = generateSalt();
        const recoveryKeySalt = generateSalt();
        const derivedUserKeyPromise = deriveKey(
            data.masterPassword,
            userKeySalt
        );
        const derivedRecoveryKeyPromise = deriveKey(
            recoveryKey,
            recoveryKeySalt
        );
        const [derivedUserKey, derivedRecoveryKey] = await Promise.all([
            derivedUserKeyPromise,
            derivedRecoveryKeyPromise,
        ]);

        /* encrypt the master key with both user key and recovery key */
        const encryptedMasterKeyPromise = encrypt(masterKey, derivedUserKey);
        const encryptedRecoveryKeyPromise = encrypt(
            masterKey,
            derivedRecoveryKey
        );

        const [encryptedMasterKey, encryptedRecoveryKey] = await Promise.all([
            encryptedMasterKeyPromise,
            encryptedRecoveryKeyPromise,
        ]);

        await createMasterPasswordMutation.mutateAsync(
            {
                data: {
                    masterPassword: data.masterPassword,
                    masterKey: { ...encryptedMasterKey, salt: userKeySalt },
                    recoveryKey: {
                        ...encryptedRecoveryKey,
                        salt: recoveryKeySalt,
                    },
                },
            },
            {
                onSuccess: async () => {
                    await refreshTokenMutation.mutate();
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
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Master Password</CardTitle>
                    <CardDescription>Create a master password</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            className="space-y-4"
                            onSubmit={form.handleSubmit(onSubmit)}
                            autoComplete="off"
                        >
                            <FormField
                                control={form.control}
                                name="masterPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Master Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                placeholder="Enter Master Password"
                                                {...field}
                                            />
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
                                        <FormLabel>
                                            Confirm Master Password
                                        </FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                placeholder="Enter Confirm Master Password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-20"
                                disabled={
                                    createMasterPasswordMutation.isPending
                                }
                            >
                                {createMasterPasswordMutation.isPending ? (
                                    <LoadingSpinner />
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <RecoveryKeyDialog />
        </div>
    );
}
