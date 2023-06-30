import { useEffect, useState } from "react";

export type Home = {
  lat: number;
  lon: number;
  city: string;
  country: string;
};

export type LatLngZoom = {
  lat: number;
  lng: number;
  z: number;
};

const getLocationFromLocalStorage = (): LatLngZoom | undefined => {
  try {
    const [z, lat, lng] = localStorage.mapExtent.split("/").map(Number);
    if (Number.isNaN(z + lat + lng)) throw new Error(".");
    return { z, lat, lng };
  } catch {
    return undefined;
  }
};

export const useHomeLocation = () => {
  const [home, setHome] = useState(getLocationFromLocalStorage());

  useEffect(() => {
    if (!home) {
      fetch("https://3.kyle.kiwi")
        .then((r): Promise<Home> => r.json())
        .then((h) => setHome({ lat: h.lat, lng: h.lon, z: 18 }));
    }
  }, [home]);

  return home;
};
