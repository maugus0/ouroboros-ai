import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/** Safe for HTML attribute values (meta content="..."). */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Injects VITE_APP_VERSION into index.html at build time (for deploy verification). */
function injectAppVersion() {
  return {
    name: "inject-app-version",
    transformIndexHtml(html: string) {
      const version = escapeHtml(process.env.VITE_APP_VERSION ?? "");
      return html.replace("__VITE_APP_VERSION__", version);
    },
  };
}

export default defineConfig({
  base: "/",
  plugins: [react(), injectAppVersion()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8080,
    host: "::",
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
