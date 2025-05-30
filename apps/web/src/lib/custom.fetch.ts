import {
    getPostApiV1AuthRefreshTokenUrl,
    postApiV1AuthRefreshToken,
} from "@/api-client/api";
import { PostApiV1AuthRefreshToken200 } from "@/api-client/api.schemas";
import { useStore } from "@/store/store";
import {
    getRefreshToken,
    getToken,
    isTokenExpired,
    removeRefreshToken,
    removeToken,
    setRefreshToken,
    setToken,
} from "./auth";

function getBody<T>(c: Response | Request): Promise<T> {
    const contentType = c.headers.get("content-type");

    if (contentType?.includes("application/json")) {
        return c.json();
    }

    if (contentType?.includes("application/pdf")) {
        return c.blob() as Promise<T>;
    }

    return c.text() as Promise<T>;
}

function getUrl(contextUrl: string): string {
    const baseUrl = import.meta.env.VITE_BE_BASE_URL ?? "http://localhost:3000";
    const url = new URL(`${baseUrl}${contextUrl}`);

    return url.toString();
}

function getHeaders(headers?: HeadersInit): HeadersInit {
    const token = getToken();
    return {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
    };
}

// Create a request queue to hold pending requests during token refresh
let requestQueue: (() => void)[] = [];
let refreshTokenPromise: Promise<
    PostApiV1AuthRefreshToken200 | undefined
> | null = null;
let isRefreshing = false;

export async function customFetch<T>(
    url: string,
    options: RequestInit
): Promise<T> {
    // If a token refresh is in progress, queue this request
    if (isRefreshing && url !== getPostApiV1AuthRefreshTokenUrl()) {
        return new Promise<T>((resolve, reject) => {
            requestQueue.push(() => {
                customFetch<T>(url, options).then(resolve).catch(reject);
            });
        });
    }
    const requestUrl = getUrl(url);
    const requestHeaders = getHeaders(options.headers);

    const requestInit: RequestInit = {
        ...options,
        headers: requestHeaders,
    };

    let request = new Request(requestUrl, requestInit);

    let response = await fetch(request);

    if (response.status === 401) {
        const refreshResponse = await handleRefreshToken();

        if (refreshResponse) {
            // Retry the original request with the new token
            const requestUrl = getUrl(url);
            const requestHeaders = getHeaders(options.headers);
            const requestInit: RequestInit = {
                ...options,
                headers: requestHeaders,
            };
            request = new Request(requestUrl, requestInit);
            response = await fetch(request);
        }
    }

    const data = await getBody<T>(response);

    if (!response.ok) {
        console.error("Error Response: ", data);
        throw data;
    }

    return data as T;
}

// Function to process the queued requests
function processQueue() {
    // Create a copy of the queue and clear the original
    const queue = [...requestQueue];
    requestQueue = [];

    // Execute each queued request
    queue.forEach((request) => {
        request();
    });
}

export async function handleRefreshToken() {
    if (refreshTokenPromise) {
        return refreshTokenPromise;
    }

    refreshTokenPromise = refreshToken().finally(() => {
        // Always reset the promise when done, regardless of success/failure
        refreshTokenPromise = null;
        isRefreshing = false;
        processQueue();
    });

    return refreshTokenPromise;
}

export async function refreshToken() {
    const {
        setIsAuthenticated,
        setIsEmailVerified,
        setIsMasterPasswordSet,
        setUserKey,
        setMasterkey,
        setRecoveryKey,
    } = useStore.getState();

    const onRefreshTokenError = () => {
        removeToken();
        removeRefreshToken();
        setIsAuthenticated(false);
        setIsEmailVerified(null);
        setIsMasterPasswordSet(null);
        setUserKey(null);
        setMasterkey(null);
        setRecoveryKey("");
        window.location.href = "/login";
    };
    const token = getRefreshToken();

    if (token == null || isTokenExpired(token)) {
        onRefreshTokenError();
        return;
    }

    try {
        const response = await postApiV1AuthRefreshToken({
            refreshToken: token,
        });

        setToken(response.data.token);
        setRefreshToken(response.data.refreshToken);
        return response;
    } catch {
        onRefreshTokenError();
    }
}
