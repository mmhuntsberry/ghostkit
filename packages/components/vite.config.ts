import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
  // run Vite from the lib folder
  root: __dirname,

  build: {
    lib: {
      // your entry point
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "components",
      formats: ["es", "cjs"],
      fileName: (format) => `components.${format}.js`,
    },
    // output next to the workspace dist folder
    outDir: path.resolve(__dirname, "../../dist/packages/components"),
    emptyOutDir: true,
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: { react: "React", "react-dom": "ReactDOM" },
      },
    },
  },

  plugins: [
    react(),
    // make TS path aliases work
    tsconfigPaths({ projects: [path.resolve(__dirname, "tsconfig.lib.json")] }),
    // generate .d.ts files
    dts({ tsConfigFilePath: path.resolve(__dirname, "tsconfig.lib.json") }),
  ],
});
