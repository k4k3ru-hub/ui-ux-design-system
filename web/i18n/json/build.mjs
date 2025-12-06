import { build } from "esbuild";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkgRoot = __dirname;

await build({
    entryPoints: [path.join(pkgRoot, "script.js")],
    outfile: path.join(pkgRoot, "dist/index.js"),
    bundle: true,
    minify: true,
    platform: "browser",
    format: "esm",
    sourcemap: true,
}).then(() => {
    console.log(`built successfully: package=@k4k3ru/i18n-json`);
});
