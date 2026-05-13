import path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import Components from "unplugin-vue-components/vite";
import MotionResolver from "motion-v/resolver";
import tailwindcss from "@tailwindcss/vite";
import { genContentCardsPlugin } from "./vite-plugin-gen-cards";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    genContentCardsPlugin(),
    Components({
      dts: true,
      resolvers: [MotionResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
