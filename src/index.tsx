import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthGateway, EditorWrapper, MapWrapper } from "./context";
import { App } from "./App";
import { i18nReady } from "./i18n";

import "./style";

i18nReady.then(() => {
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
});
