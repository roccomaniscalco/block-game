import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges and conditionally applies Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a correctly typed array of keys of the object
 */
export const getObjectKeys = Object.keys as <T extends object>(
  obj: T,
) => Array<keyof T>;

/**
 * Returns a correctly typed array of values of the object
 */
export const getObjectValues = Object.values as <T extends object>(
  obj: T,
) => Array<(typeof obj)[keyof typeof obj]>;

export function array<T>(length: number): T[];
export function array<T>(length: number, value: T): T[];

export function array<T>(length: number, value?: T) {
  if (!value) return Array.from({ length });
  return Array.from({ length }, () => value);
}
