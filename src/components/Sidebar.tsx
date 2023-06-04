import { useContext } from "react";
import { AuthContext } from "../context";

export const Sidebar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <>
      Hi {user.display_name}. Version {VERSION}{" "}
      <button type="button" onClick={logout}>
        Logout
      </button>
    </>
  );
};
