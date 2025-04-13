
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    // Add node polyfills for browser compatibility
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports
      protocolImports: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Define process.env for pg library
    "process.env": {
      POSTGRES_USER: 'postgres',
      POSTGRES_HOST: 'localhost',
      POSTGRES_DB: 'cryptoview',
      POSTGRES_PASSWORD: 'postgres',
      POSTGRES_PORT: '5432',
    },
  },
}));
