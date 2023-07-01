/**
 * throws an error if this function is invoked.
 * Useful to get TypeScript to check if the argument is
 * of type `never`.
 */
export function assertIsNever(data: never): never {
  throw new Error(`Invariant failed. “${data}” should be never`);
}
