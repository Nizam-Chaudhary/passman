// localstorage
export const AUTH_TOKEN = "pm_access_token";
export const REFRESH_TOKEN = "pm_refresh_token";

// App routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGN_UP: "/sign-up",
  VERIFY_ACCOUNT: "/verify-account",
  MASTER_PASSWORD: {
    CREATE: "/master-password/create",
    VERIFY: "/master-password/verify",
    RESET: "/:type/master-password",
  },
  RESET_PASSWORD: {
    EMAIL: "/reset-password/email",
    UPDATE: "/reset-password/update",
  },
  SETTINGS: "/settings",
};
