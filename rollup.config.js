import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import externals from "rollup-plugin-node-externals";
import pkg from "./package.json" assert { type: "json" };
import path from "path";

export default defineConfig({
    input: "src/index.ts",
    output: {
        dir: path.dirname(pkg.module),
        format: "esm",
        preserveModules: true
    },
    plugins: [
        nodeResolve(),
        externals({
            devDeps: false
        }),
        typescript()
    ],
});
