import { build } from "esbuild";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkgRoot = __dirname;

await build({
    entryPoints: [path.join(pkgRoot, "script.js")],
    outfile: path.join(pkgRoot, "dist/script.js"),
    bundle: true,
    minify: true,
    platform: "browser",
    format: "esm",
    sourcemap: true,
}).then(() => {
    console.log(`built JS successfully: package=@k4k3ru/toaster`);
});
await build({
    entryPoints: [path.join(pkgRoot, "style.css")],
    outfile: path.join(pkgRoot, "dist/style.css"),
    bundle: true,
    minify: true,
    platform: "browser",
    sourcemap: true,
}).then(() => {
    console.log(`built CSS successfully: package=@k4k3ru/toaster`);
});
