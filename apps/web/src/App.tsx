import { Toaster } from "@/components/ui/toaster.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import AppRoutes from "./routes.tsx";

const queryClient = new QueryClient();

export function App() {
    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <QueryClientProvider client={queryClient}>
                    <ReactQueryDevtools initialIsOpen={false} />
                    <Toaster />
                    <AppRoutes />
                </QueryClientProvider>
            </ThemeProvider>
        </>
    );
}
