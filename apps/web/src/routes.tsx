import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useLocation,
} from "react-router";
import { useShallow } from "zustand/react/shallow";
import LoadingSpinner from "./components/ui/loadingSpinner";
import useAuth from "./hooks/use-auth";
import { ROUTES } from "./lib/constants";
import CreateMasterPassword from "./pages/CreateMasterPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ResetMasterPassword from "./pages/ResetMasterPassword";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordSendMail from "./pages/ResetPasswordSendMail";
import Settings from "./pages/Settings";
import SignUp from "./pages/SignUp";
import VerifyAccount from "./pages/VerifyAccount";
import VerifyMasterPassword from "./pages/VerifyMasterPassword";
import { useStore } from "./store/store";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Protected routes */}
                <Route
                    path={ROUTES.HOME}
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path={ROUTES.SETTINGS}
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />

                {/* Public Routes */}
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
                <Route
                    path={ROUTES.RESET_PASSWORD.EMAIL}
                    element={<ResetPasswordSendMail />}
                />
                <Route
                    path={ROUTES.RESET_PASSWORD.UPDATE}
                    element={<ResetPassword />}
                />

                {/* Auth Required Routes */}
                <Route
                    path={ROUTES.VERIFY_ACCOUNT}
                    element={
                        <VerifyEmailRoute>
                            <VerifyAccount />
                        </VerifyEmailRoute>
                    }
                />
                <Route
                    path={ROUTES.MASTER_PASSWORD.VERIFY}
                    element={
                        <ResetOrVerifyMasterPasswordRoute>
                            <VerifyMasterPassword />
                        </ResetOrVerifyMasterPasswordRoute>
                    }
                />

                <Route
                    path={ROUTES.MASTER_PASSWORD.RESET}
                    element={
                        <ResetOrVerifyMasterPasswordRoute>
                            <ResetMasterPassword />
                        </ResetOrVerifyMasterPasswordRoute>
                    }
                />

                <Route
                    path={ROUTES.MASTER_PASSWORD.CREATE}
                    element={
                        <CreateMasterPasswordRoute>
                            <CreateMasterPassword />
                        </CreateMasterPasswordRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

// Protected Route Wrapper Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const { isEmailVerified, isMasterPasswordSet } = useStore(
        useShallow((state) => ({
            isEmailVerified: state.isEmailVerified,
            isMasterPasswordSet: state.isMasterPasswordSet,
        }))
    );
    const location = useLocation();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    // Check authentication
    if (isAuthenticated == false) {
        return (
            <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
        );
    }

    if (!isMasterPasswordSet) {
        return (
            <Navigate
                to={ROUTES.MASTER_PASSWORD.CREATE}
                state={{ from: location }}
                replace
            />
        );
    }

    if (isEmailVerified == false) {
        return (
            <Navigate
                to={ROUTES.VERIFY_ACCOUNT}
                state={{ from: location }}
                replace
            />
        );
    }
    return <>{children}</>;
}

// // Public Route Wrapper Component
// const PublicRoute = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated } = useAuth();
//   const location = useLocation();
//   const from = location.state?.from?.pathname || "/";

//   if (isAuthenticated == null) {
//     return <LoadingSpinner />;
//   }

//   if (isAuthenticated == false) {
//     return <Navigate to={from} replace />;
//   }

//   return <>{children}</>;
// };

// Verify Account Route Wrapper Component
function VerifyEmailRoute({ children }: { children: React.ReactNode }) {
    const { isEmailVerified } = useStore(
        useShallow((state) => ({
            isEmailVerified: state.isEmailVerified,
        }))
    );
    if (isEmailVerified == null) {
        return <Navigate to={ROUTES.MASTER_PASSWORD.VERIFY} replace />;
    }

    if (isEmailVerified) {
        return <Navigate to={ROUTES.MASTER_PASSWORD.VERIFY} replace />;
    }

    return <>{children}</>;
}

// Master password Route Wrapper Component
function ResetOrVerifyMasterPasswordRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, userData, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isAuthenticated == false) {
        return (
            <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
        );
    }

    if (userData?.masterKeyCreated == false) {
        return (
            <Navigate
                to={ROUTES.MASTER_PASSWORD.CREATE}
                state={{ from: location }}
                replace
            />
        );
    }

    return <>{children}</>;
}

// Master password Route Wrapper Component
function CreateMasterPasswordRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, userData, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isAuthenticated == false) {
        return (
            <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
        );
    }

    if (userData?.masterKeyCreated == true) {
        return (
            <Navigate
                to={ROUTES.MASTER_PASSWORD.VERIFY}
                state={{ from: location }}
                replace
            />
        );
    }

    return <>{children}</>;
}
