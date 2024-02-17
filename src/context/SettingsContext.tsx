import { PropsWithChildren, useMemo, useState, createContext } from "react";
import { TransportMode } from "../constants";

type ISettingsContext = {
  transportMode: TransportMode;
  setTransportMode: SetState<TransportMode>;
};
export const SettingsContext = createContext({} as ISettingsContext);
SettingsContext.displayName = "SettingsContext";

/** settings that are independant of the current editor session */
export const SettingsWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const [transportMode, setTransportMode] = useState<TransportMode>("ROAD");

  const context = useMemo<ISettingsContext>(
    () => ({
      transportMode,
      setTransportMode,
    }),
    [transportMode, setTransportMode],
  );

  return (
    <SettingsContext.Provider value={context}>
      {children}
    </SettingsContext.Provider>
  );
};
