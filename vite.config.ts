import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
const { resolve } = require("path");
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import viteCompression from "vite-plugin-compression";
import { svgBuilder } from "./src/plugins/svg";
import { devUrl } from "./src/api/url";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [ElementPlusResolver()],
      directoryAsNamespace: true,
    }),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: "gzip",
      ext: ".gz",
    }),
    svgBuilder("./src/assets/svg/"),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "~": resolve(__dirname, "."),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 80,
    proxy: {
      "/apiProxy": {
        // // target: "http://192.168.1.105:3100",
        // // target: "http://120.232.251.174:9000",
        // target: "http://172.20.7.37:3100",
        // // target: "http://154.91.39.84:9000",
        target: devUrl.target,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/apiProxy/, ""),
      },
    },
  },
  esbuild: {
    jsxInject: "import { h } from 'vue';",
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },
  build: {
    sourcemap: false,
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "element-plus": ["element-plus"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
