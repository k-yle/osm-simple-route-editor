import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthGateway, EditorWrapper } from "./context";
import { App } from "./App";

import "./style";

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <AuthGateway>
      <EditorWrapper>
        <App />
      </EditorWrapper>
    </AuthGateway>
  </StrictMode>
);
