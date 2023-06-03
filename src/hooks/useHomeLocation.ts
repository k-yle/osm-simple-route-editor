import { useEffect, useState } from "react";

export type Home = {
  lat: number;
  lon: number;
  city: string;
  country: string;
};

const FALLBACK: Home = {
  lat: 37.3417,
  lon: -121.9753,
  city: "Santa Clara",
  country: "United States",
};

export const useHomeLocation = () => {
  const [home, setHome] = useState<Home>(FALLBACK);

  useEffect(() => {
    fetch("https://3.kyle.kiwi")
      .then((r) => r.json())
      .then(setHome);
  }, []);

  return home;
};
