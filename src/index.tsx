import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  AuthGateway,
  EditorWrapper,
  MapWrapper,
  ThemeWrapper,
} from "./context";
import { App } from "./App";
import { i18nReady } from "./i18n";

import "./style";
import { SettingsWrapper } from "./context/SettingsContext";

i18nReady.then(() => {
  createRoot(document.querySelector("#root")!).render(
    <StrictMode>
      <ThemeWrapper>
        <AuthGateway>
          <SettingsWrapper>
            <EditorWrapper>
              <MapWrapper>
                <App />
              </MapWrapper>
            </EditorWrapper>
          </SettingsWrapper>
        </AuthGateway>
      </ThemeWrapper>
    </StrictMode>,
  );
});
