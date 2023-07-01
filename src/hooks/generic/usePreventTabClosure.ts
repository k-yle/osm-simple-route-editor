import { useEffect } from "react";

/**
 * opens a browser dialog if you try to close the tab while
 * you have unsaved changed.
 *
 * @param shouldEnable - this hook does nothing if this argument is false.
 */
export const usePreventTabClosure = (shouldEnable: boolean) => {
  useEffect(() => {
    if (!shouldEnable) return;

    function onCloseTab(event: BeforeUnloadEvent) {
      event.preventDefault();
      // eslint-disable-next-line no-param-reassign -- required by the spec
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", onCloseTab);
    return () => window.removeEventListener("beforeunload", onCloseTab);
  }, [shouldEnable]);
};
