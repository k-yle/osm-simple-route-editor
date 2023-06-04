import { useEffect } from "react";

/** @param callback must be memorized */
export const useKeyboardShortcut = (key: string, callback: () => void) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === key) callback();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [key, callback]);
};
