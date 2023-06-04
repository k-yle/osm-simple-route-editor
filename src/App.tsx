import { memo } from "react";
import { Map, Sidebar, Windows } from "./components";

// memo to prevent root-level context updates from rerendering the whole app
export const App = memo(() => {
  return (
    <Windows sidebar={<Sidebar />}>
      <Map />
    </Windows>
  );
});
App.displayName = "App";
