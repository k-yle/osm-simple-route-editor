import { useState, createContext, useMemo, PropsWithChildren } from "react";
import type L from "leaflet";

type IMapContext = {
  map: L.Map | null;
  setMap: SetState<L.Map | null>;
};

export const MapContext = createContext({} as IMapContext);
MapContext.displayName = "MapContext";

export const MapWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const [map, setMap] = useState<L.Map | null>(null);

  const context = useMemo<IMapContext>(() => ({ map, setMap }), [map, setMap]);

  return <MapContext.Provider value={context}>{children}</MapContext.Provider>;
};
