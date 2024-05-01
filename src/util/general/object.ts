export const swapArrayItem = <T>(original: T[], a: number, b: number): T[] => {
  const x = [...original];
  [x[a], x[b]] = [x[b], x[a]];
  return x;
};
