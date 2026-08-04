import { relative, resolve } from "node:path";
import { HtmlComponentTransformer } from "./transform.js";
export class HtmlComponentVitePlugin {
    options;
    componentsDirectory = "";
    transformer = null;
    constructor(options = {}) {
        this.options = options;
    }
    create() {
        return {
            name: "@k4k3ru/build-html-component",
            enforce: "pre",
            configResolved: (config) => {
                this.configure(config);
            },
            transformIndexHtml: {
                order: "pre",
                handler: async (html) => {
                    return this.getTransformer().transform(html);
                },
            },
            configureServer: (server) => {
                this.configureServer(server);
            },
        };
    }
    configure(config) {
        this.componentsDirectory = resolve(config.root, this.options.componentsDirectory ?? "components");
        this.transformer = new HtmlComponentTransformer({
            componentsDirectory: this.componentsDirectory,
        });
    }
    configureServer(server) {
        if (this.componentsDirectory === "") {
            throw new Error("HTML component plugin has not been configured");
        }
        server.watcher.add(this.componentsDirectory);
        const reload = (filePath) => {
            if (!this.isComponentHtml(filePath)) {
                return;
            }
            server.ws.send({
                type: "full-reload",
                path: "*",
            });
        };
        server.watcher.on("change", reload);
        server.watcher.on("add", reload);
        server.watcher.on("unlink", reload);
    }
    getTransformer() {
        if (!this.transformer) {
            throw new Error("HTML component plugin has not been configured");
        }
        return this.transformer;
    }
    isComponentHtml(filePath) {
        if (!filePath.endsWith(".html")) {
            return false;
        }
        const relativePath = relative(this.componentsDirectory, filePath);
        return (relativePath !== "" &&
            relativePath !== ".." &&
            !relativePath.startsWith("../") &&
            !relativePath.startsWith("..\\"));
    }
}
export function htmlComponentPlugin(options = {}) {
    return new HtmlComponentVitePlugin(options).create();
}
