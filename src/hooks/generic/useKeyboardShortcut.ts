import { useEffect } from "react";

type Modifier = "shiftKey" | "ctrlKey" | "altKey" | "metaKey";

/** returns "Command" on macos and "Ctrl"/"Strg" on windows */
export const realCtrlKey: Modifier = navigator.platform.startsWith("Mac")
  ? "metaKey"
  : "ctrlKey";

/** @param callback must be memorized */
export const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  modifier?: Modifier,
) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isModifierDown = modifier ? event[modifier] : true;
      if (event.key === key && isModifierDown) callback();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [key, modifier, callback]);
};
