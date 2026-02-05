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
    console.log(`built JS successfully: file=script.js package=@k4k3ru/layout`);
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
    console.log(`built minified JS successfully: file=script.js package=@k4k3ru/layout`);
});
await build({
    entryPoints: [path.join(pkgRoot, "navigation_rail.js")],
    outfile: path.join(pkgRoot, "dist/navigation_rail.mjs"),
    bundle: true,
    platform: "browser",
    format: "esm",
    sourcemap: true,
}).then(() => {
    console.log(`built JS successfully: file=navigation_rail.js package=@k4k3ru/layout`);
});
await build({
    entryPoints: [path.join(pkgRoot, "navigation_rail.js")],
    outfile: path.join(pkgRoot, "dist/navigation_rail.min.mjs"),
    bundle: true,
    minify: true,
    platform: "browser",
    format: "esm",
    sourcemap: true,
}).then(() => {
    console.log(`built minified JS successfully: file=navigation_rail.js package=@k4k3ru/layout`);
});
await build({
    entryPoints: [path.join(pkgRoot, "bottom_navigation_bar.css")],
    outfile: path.join(pkgRoot, "dist/bottom_navigation_bar.css"),
    bundle: true,
    platform: "browser",
    sourcemap: true,
}).then(() => {
    console.log(`built CSS successfully: file=bottom_navigation_bar.css package=@k4k3ru/layout`);
});
await build({
    entryPoints: [path.join(pkgRoot, "bottom_navigation_bar.css")],
    outfile: path.join(pkgRoot, "dist/bottom_navigation_bar.min.css"),
    bundle: true,
    minify: true,
    platform: "browser",
    sourcemap: true,
}).then(() => {
    console.log(`built minified CSS successfully: file=bottom_navigation_bar.css package=@k4k3ru/layout`);
});
await build({
    entryPoints: [path.join(pkgRoot, "layout.css")],
    outfile: path.join(pkgRoot, "dist/layout.css"),
    bundle: true,
    platform: "browser",
    sourcemap: true,
}).then(() => {
    console.log(`built CSS successfully: file=layout.css package=@k4k3ru/layout`);
});
await build({
    entryPoints: [path.join(pkgRoot, "layout.css")],
    outfile: path.join(pkgRoot, "dist/layout.min.css"),
    bundle: true,
    minify: true,
    platform: "browser",
    sourcemap: true,
}).then(() => {
    console.log(`built minified CSS successfully: file=layout.css package=@k4k3ru/layout`);
});
await build({
    entryPoints: [path.join(pkgRoot, "navigation_drawer.css")],
    outfile: path.join(pkgRoot, "dist/navigation_drawer.css"),
    bundle: true,
    platform: "browser",
    sourcemap: true,
}).then(() => {
    console.log(`built CSS successfully: file=navigation_drawer.css package=@k4k3ru/layout`);
});
await build({
    entryPoints: [path.join(pkgRoot, "navigation_drawer.css")],
    outfile: path.join(pkgRoot, "dist/navigation_drawer.min.css"),
    bundle: true,
    minify: true,
    platform: "browser",
    sourcemap: true,
}).then(() => {
    console.log(`built minified CSS successfully: file=navigation_drawer.css package=@k4k3ru/layout`);
});
await build({
    entryPoints: [path.join(pkgRoot, "navigation_rail.css")],
    outfile: path.join(pkgRoot, "dist/navigation_rail.css"),
    bundle: true,
    platform: "browser",
    sourcemap: true,
}).then(() => {
    console.log(`built CSS successfully: file=navigation_rail.css package=@k4k3ru/layout`);
});
await build({
    entryPoints: [path.join(pkgRoot, "navigation_rail.css")],
    outfile: path.join(pkgRoot, "dist/navigation_rail.min.css"),
    bundle: true,
    minify: true,
    platform: "browser",
    sourcemap: true,
}).then(() => {
    console.log(`built minified CSS successfully: file=navigation_rail.css package=@k4k3ru/layout`);
});
await build({
    entryPoints: [path.join(pkgRoot, "panel.css")],
    outfile: path.join(pkgRoot, "dist/panel.css"),
    bundle: true,
    platform: "browser",
    sourcemap: true,
}).then(() => {
    console.log(`built CSS successfully: file=panel.css package=@k4k3ru/layout`);
});
await build({
    entryPoints: [path.join(pkgRoot, "panel.css")],
    outfile: path.join(pkgRoot, "dist/panel.min.css"),
    bundle: true,
    minify: true,
    platform: "browser",
    sourcemap: true,
}).then(() => {
    console.log(`built minified CSS successfully: file=panel.css package=@k4k3ru/layout`);
});
await build({
    entryPoints: [path.join(pkgRoot, "style.css")],
    outfile: path.join(pkgRoot, "dist/style.css"),
    bundle: true,
    platform: "browser",
    sourcemap: true,
}).then(() => {
    console.log(`built CSS successfully: file=style.css package=@k4k3ru/layout`);
});
await build({
    entryPoints: [path.join(pkgRoot, "style.css")],
    outfile: path.join(pkgRoot, "dist/style.min.css"),
    bundle: true,
    minify: true,
    platform: "browser",
    sourcemap: true,
}).then(() => {
    console.log(`built minified CSS successfully: file=style.css package=@k4k3ru/layout`);
});
await build({
    entryPoints: [path.join(pkgRoot, "top_app_bar.css")],
    outfile: path.join(pkgRoot, "dist/top_app_bar.css"),
    bundle: true,
    platform: "browser",
    sourcemap: true,
}).then(() => {
    console.log(`built CSS successfully: file=top_app_bar.css package=@k4k3ru/layout`);
});
await build({
    entryPoints: [path.join(pkgRoot, "top_app_bar.css")],
    outfile: path.join(pkgRoot, "dist/top_app_bar.min.css"),
    bundle: true,
    minify: true,
    platform: "browser",
    sourcemap: true,
}).then(() => {
    console.log(`built minified CSS successfully: file=top_app_bar.css package=@k4k3ru/layout`);
});
