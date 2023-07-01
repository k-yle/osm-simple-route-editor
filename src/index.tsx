import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthGateway, EditorWrapper, MapWrapper } from "./context";
import { App } from "./App";

import "./style";

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <AuthGateway>
      <EditorWrapper>
        <MapWrapper>
          <App />
        </MapWrapper>
      </EditorWrapper>
    </AuthGateway>
  </StrictMode>
);
