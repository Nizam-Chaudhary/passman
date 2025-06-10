import type { SubmitHandler } from "react-hook-form";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { PasswordInput } from "@/components/ui/password-input";
import { useRefreshToken } from "@/hooks/refresh-token";
import { useToast } from "@/hooks/use-toast";
import { ROUTES } from "@/lib/constants";
import { decrypt, deriveKey, importKey } from "@/lib/encryption.helper";
import { replaceRouteParams } from "@/lib/utils";
import { useStore } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
import {
    verifyMasterPasswordBodySchema,
    type VerifyMasterPasswordBody,
} from "@passman/schema/api/user";
import { useVerifyMasterPassword } from "@/services/mutations/user";

export default function VerifyMasterPassword() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setIsMasterPasswordSet, setMasterkey } = useStore(
        useShallow((state) => ({
            setIsMasterPasswordSet: state.setIsMasterPasswordSet,
            setMasterkey: state.setMasterkey,
        }))
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

    const onSubmit: SubmitHandler<VerifyMasterPasswordBody> = async (
        data,
        event
    ) => {
        event?.preventDefault();
        setIsSubmitting(true);
        await verifyMasterPasswordMutation.mutateAsync(data, {
            onSuccess: async (response) => {
                const userKey = await deriveKey(
                    data.masterPassword,
                    response.data.masterKey.salt
                );

                setIsSubmitting(false);
                const decryptedMasterKey = await decrypt(
                    response.data.masterKey,
                    userKey
                );
                const masterKey = await importKey(decryptedMasterKey);
                setMasterkey(masterKey);
                setIsMasterPasswordSet(true);
                navigate(ROUTES.HOME, { replace: true });
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
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Master Password</CardTitle>
                    <CardDescription>
                        Enter existing Master password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            className="space-y-4"
                            onSubmit={form.handleSubmit(onSubmit)}
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
                            <Button
                                type="submit"
                                className="w-20"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <LoadingSpinner /> : "Submit"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <NavLink
                        className="text-blue-600"
                        to={replaceRouteParams(ROUTES.MASTER_PASSWORD.RESET, {
                            type: "recover",
                        })}
                    >
                        Forgot master password
                    </NavLink>
                </CardFooter>
            </Card>
        </div>
    );
}
