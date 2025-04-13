
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
    // Enhanced node polyfills configuration
    nodePolyfills({
      // Whether to polyfill specific globals
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Whether to polyfill specific modules
      protocolImports: true,
      // Explicitly include all Node.js util modules
      include: ['util', 'stream', 'events', 'crypto', 'path', 'buffer', 'querystring', 'url', 'string_decoder']
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Define process.env for library compatibility
    "process.env": {
      POSTGRES_USER: 'postgres',
      POSTGRES_HOST: 'localhost',
      POSTGRES_DB: 'cryptoview',
      POSTGRES_PASSWORD: 'postgres',
      POSTGRES_PORT: '5432',
      NODE_ENV: mode,
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
}));
