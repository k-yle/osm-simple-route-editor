// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    VERSION: JSON.stringify(process.env.npm_package_version),
  },
  server: {
    host: "127.0.0.1",
    port: 3000,
  },
});
