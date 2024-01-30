import { memo } from "react";
import { Notifications } from "@mantine/notifications";
import { Map, Sidebar, Windows } from "./components";
import { Navbar } from "./components/Navbar";

// memo to prevent root-level context updates from rerendering the whole app
export const App = memo(() => {
  return (
    <>
      <Navbar />
      <Notifications />
      <Windows sidebar={<Sidebar />}>
        <Map />
      </Windows>
    </>
  );
});
App.displayName = "App";
