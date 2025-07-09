import type { ClassValue } from "clsx";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(value: string) {
  const words = value.split(" ");
  const initials = words[0].charAt(0).toUpperCase() + (words[1] ?? "").charAt(0).toUpperCase();
  return initials;
}
