import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function makeQueryString(
    params: Record<string, string | number | boolean | undefined | null>
) {
    const results = Object.entries(params)
        .filter(([, value]) => value != null)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
    return results ? `?${results}` : "";
}

/**
 * Replaces URL route parameters with their corresponding values
 * @param url - The URL string containing route parameters in the format `:paramName`
 * @param params - An object mapping parameter names to their values
 * @returns The URL with all route parameters replaced with their values
 */
export function replaceRouteParams(
    url: string,
    params: Record<string, string>
): string {
    let updatedUrl = url;
    for (const [name, value] of Object.entries(params)) {
        updatedUrl = updatedUrl.replace(`:${name}`, value);
    }

    return updatedUrl;
}

export function getInitials(value: string) {
    console.log("value", value);
    const words = value.split(" ");
    const initials =
        words[0].charAt(0).toUpperCase() +
        (words[1] ?? "").charAt(0).toUpperCase();
    return initials;
}
