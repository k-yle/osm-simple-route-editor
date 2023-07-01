//
// copy-pasted from https://github.com/osm-nz/osm-nz.github.io/blob/2cecc2d/src/wrappers/AuthGateway.tsx
//
import {
  useState,
  createContext,
  useCallback,
  useMemo,
  useEffect,
  PropsWithChildren,
} from "react";
import { getUser, isLoggedIn, login, logout, OsmOwnUser } from "osm-api";
import { LoginErrorPage, LoginPage, LoginWaitingForPopupPage } from "../pages";

type IAuthContext = {
  user: OsmOwnUser;
  logout(): void;
};
export const AuthContext = createContext({} as IAuthContext);
AuthContext.displayName = "AuthContext";

export const AuthGateway: React.FC<PropsWithChildren> = ({ children }) => {
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [user, setUser] = useState<OsmOwnUser>();

  useEffect(() => {
    if (loggedIn) {
      getUser("me").then(setUser).catch(setError);
    }
  }, [loggedIn]);

  const onClickLogin = useCallback(async () => {
    try {
      setLoading(true);
      await login({
        clientId:
          // the clientId is not confidential, it's alright to define it here
          window.location.hostname === "127.0.0.1"
            ? "oPbyNuXQIEh8ZI3zbjVWVmVyIaNB2guU6uLP2gQ3sfs"
            : "rGcXPyMLc20ZFKw7ZybqZCZLhhydXKK5p027POLT2AY",
        mode: "popup",
        redirectUrl:
          window.location.hostname === "127.0.0.1"
            ? "http://127.0.0.1:3000/land.html"
            : "https://osm-simple-route-editor.kyle.kiwi/land.html",
        scopes: ["read_prefs", "write_api"],
      });

      setLoggedIn(true);
      setLoading(false);
      setError(undefined);
    } catch (ex) {
      setError(ex as Error);
      setLoading(false);
    }
  }, []);

  const onLogout = useCallback(() => {
    logout();
    setLoggedIn(false);
    setUser(undefined);
    setError(undefined);
  }, []);

  const context = useMemo(
    () => ({ user: user!, logout: onLogout }),
    [user, onLogout]
  );

  if (error) {
    return (
      <LoginErrorPage
        error={error}
        onClickLogin={onClickLogin}
        onClickLogout={onLogout}
      />
    );
  }

  if (loading) return <LoginWaitingForPopupPage />;

  if (!loggedIn) return <LoginPage onClickLogin={onClickLogin} />;

  if (!user) return <>Loading...</>;

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};
