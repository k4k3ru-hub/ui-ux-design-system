import { build } from "esbuild";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkgRoot = __dirname;

await build({
    entryPoints: [path.join(pkgRoot, "style.css")],
    outfile: path.join(pkgRoot, "dist/style.css"),
    bundle: true,
    platform: "browser",
    sourcemap: true,
}).then(() => {
    console.log(`built CSS successfully: file=style.css package=@k4k3ru/tokens`);
});
await build({
    entryPoints: [path.join(pkgRoot, "style.css")],
    outfile: path.join(pkgRoot, "dist/style.min.css"),
    bundle: true,
    minify: true,
    platform: "browser",
    sourcemap: true,
}).then(() => {
    console.log(`built minified CSS successfully: file=style.css package=@k4k3ru/tokens`);
});
