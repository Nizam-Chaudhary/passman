import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";

import { ThemeProvider, useTheme } from "@/contexts/theme";
import "@/index.css";
import { routeTree } from "@/routeTree.gen.ts";

import LoadingSpinner from "./components/ui/loading-spinner";

const queryClient = new QueryClient();
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    theme: undefined!,
  },
  defaultPendingComponent: () => LoadingSpinner,
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// eslint-disable-next-line react-refresh/only-export-components
function App() {
  const theme = useTheme();

  return (
    <RouterProvider
      router={router}
      context={{
        theme,
      }}
    />
  );
}

// Render the app
const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="passman-theme-mode">
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}
