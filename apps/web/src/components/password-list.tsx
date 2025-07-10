import { getRouteApi } from "@tanstack/react-router";
import { useShallow } from "zustand/react/shallow";

import { useGetPasswordListForVault } from "@/services/queries/password";
import { useStore } from "@/stores";

import { PasswordCard } from "./password-card";
import { Card, CardContent } from "./ui/card";
import LoadingSpinner from "./ui/loading-spinner";
import { ScrollArea } from "./ui/scroll-area";

const routeApi = getRouteApi("/_auth/");
export function PasswordList() {
  const searchParams = routeApi.useSearch();

  const { currentVault } = useStore(
    useShallow((state) => ({
      currentVault: state.currentVault,
    })),
  );
  const {
    data: passwords,
    isPending,
    isError,
  } = useGetPasswordListForVault({
    vaultId: currentVault?.id as any,
    search: searchParams.q ?? undefined,
  });

  if (isPending) {
    return (
      <Card className="h-[calc(100vh-5.5rem)]">
        <CardContent>
          <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="h-[calc(100vh-5.5rem)]">
        <CardContent>
          <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-8">
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
              <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
                {passwords.data.map((password) => (
                  <PasswordCard key={password.id} password={password} />
                ))}
              </div>
            ) : (
              <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-8">
                <img className="w-[40vh]" src="/assets/no_data.svg" />
                <p className="text-3xl">No Passwords Found!</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
}
