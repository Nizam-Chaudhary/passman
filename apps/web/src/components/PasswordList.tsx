import { useGetApiV1Passwords } from "@/api-client/api";
import { useStore } from "@/store/store";
import { useSearchParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { PasswordRow } from "./PasswordRow";
import { Card, CardContent } from "./ui/card";
import Loading from "./ui/loading";
import { ScrollArea } from "./ui/scroll-area";

export function PasswordList() {
    const [searchParams] = useSearchParams();
    const { currentVault } = useStore(
        useShallow((state) => ({
            currentVault: state.currentVault,
        }))
    );
    const {
        data: passwords,
        isPending,
        isError,
    } = useGetApiV1Passwords(
        {
            vaultId: currentVault?.id as any,
            search: searchParams.get("q") ?? undefined,
        },
        { query: { enabled: !!currentVault?.id } }
    );

    if (isPending) {
        return (
            <Card className="h-[calc(100vh-5.5rem)]">
                <CardContent>
                    <div className="h-[calc(100vh-10rem)] flex items-center justify-center">
                        <Loading />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="h-[calc(100vh-5.5rem)]">
                <CardContent>
                    <div className="flex h-[calc(100vh-10rem)] flex-col justify-center items-center gap-8">
                        <img className="w-[40vh]" src="/assets/warning.svg" />
                        <p className="text-3xl">Error fetching passwords</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className="h-[calc(100vh-5.5rem)]">
                <CardContent className="p-0">
                    <ScrollArea className="h-[calc(100vh-5.5rem)]">
                        {passwords?.data?.length > 0 ? (
                            passwords.data.map((password, index) => (
                                <PasswordRow
                                    key={index}
                                    id={password.id.toString()}
                                    url={password.url}
                                    username={password.username}
                                />
                            ))
                        ) : (
                            <div className="flex h-[calc(100vh-10rem)] flex-col justify-center items-center gap-8">
                                <img
                                    className="w-[40vh]"
                                    src="/assets/no_data.svg"
                                />
                                <p className="text-3xl">No Passwords Found!</p>
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </>
    );
}
