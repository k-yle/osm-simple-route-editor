import { Map, Sidebar, Windows } from "./components";

export const App: React.FC = () => {
  return (
    <Windows sidebar={<Sidebar />}>
      <Map />
    </Windows>
  );
};
