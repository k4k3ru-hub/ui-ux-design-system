import { build } from "esbuild";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkgRoot = __dirname;

await build({
    entryPoints: [path.join(pkgRoot, "script.js")],
    outfile: path.join(pkgRoot, "dist/script.mjs"),
    bundle: true,
    platform: "browser",
    format: "esm",
    sourcemap: true,
}).then(() => {
    console.log(`built JS successfully: file=script.js package=@k4k3ru/components-tab`);
});
await build({
    entryPoints: [path.join(pkgRoot, "script.js")],
    outfile: path.join(pkgRoot, "dist/script.min.mjs"),
    bundle: true,
    minify: true,
    platform: "browser",
    format: "esm",
    sourcemap: true,
}).then(() => {
    console.log(`built minified JS successfully: file=script.js package=@k4k3ru/components-tab`);
});
await build({
    entryPoints: [path.join(pkgRoot, "style.css")],
    outfile: path.join(pkgRoot, "dist/style.css"),
    bundle: true,
    platform: "browser",
    sourcemap: true,
}).then(() => {
    console.log(`built CSS successfully: file=style.css package=@k4k3ru/components-tab`);
});
await build({
    entryPoints: [path.join(pkgRoot, "style.css")],
    outfile: path.join(pkgRoot, "dist/style.min.css"),
    bundle: true,
    minify: true,
    platform: "browser",
    sourcemap: true,
}).then(() => {
    console.log(`built minified CSS successfully: file=style.css package=@k4k3ru/components-tab`);
});
