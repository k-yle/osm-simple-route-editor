import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthGateway } from "./context";
import { App } from "./App";

import "./style";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthGateway>
      <App />
    </AuthGateway>
  </StrictMode>
);
