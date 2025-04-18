import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        page1: "bar-chart/index.html",
        page2: "helmet/index.html",
        page3: "kawasaki-bike/index.html",
        page4: "shelby-cobra-car/index.html",
      },
    },
  },
});
