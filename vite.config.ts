/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import subResourceIntegrity from "@small-tech/vite-plugin-sri";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), subResourceIntegrity()],
  server: {
    host: "127.0.0.1",
    port: 3000,
  },
  test: {
    environment: "jsdom",
  },
});
