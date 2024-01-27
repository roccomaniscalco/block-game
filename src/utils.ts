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
 * rotates a matrix 90 degrees clockwise
 */
export const rotateMatrix = <T>(matrix: T[][]): T[][] => {
  return matrix[0].map((_val, index) =>
    matrix.map((row) => row[index]).reverse(),
  );
};
