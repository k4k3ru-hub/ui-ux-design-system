// vite.ts
import { relative, resolve } from "node:path";
import type { Plugin, ResolvedConfig, ViteDevServer } from "vite";

import { HtmlComponentTransformer } from "./transform.js";

export interface HtmlComponentPluginOptions { componentsDirectory?: string }

export class HtmlComponentVitePlugin {
  private readonly options: HtmlComponentPluginOptions;

  private componentsDirectory = "";
  private transformer: HtmlComponentTransformer | null = null;

  public constructor(options: HtmlComponentPluginOptions = {}) {
      this.options = options;
  }

  public create(): Plugin {
    return {
      name: "@k4k3ru/build-html-component",
      enforce: "pre",
      configResolved: (config): void => {
        this.configure(config);
      },
      transformIndexHtml: {
        order: "pre",
        handler: async (html): Promise<string> => {
          return this.getTransformer().transform(html);
        },
      },
      configureServer: (server): void => {
        this.configureServer(server);
      },
    };
  }

  private configure(config: ResolvedConfig): void {
    this.componentsDirectory = resolve(config.root, this.options.componentsDirectory ?? "components");

    this.transformer = new HtmlComponentTransformer({
      componentsDirectory: this.componentsDirectory,
    });
  }

  private configureServer(server: ViteDevServer): void {
    if (this.componentsDirectory === "") {
      throw new Error("HTML component plugin has not been configured");
    }

    server.watcher.add(this.componentsDirectory);

    const reload = (filePath: string): void => {
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

  private getTransformer(): HtmlComponentTransformer {
    if (!this.transformer) {
      throw new Error("HTML component plugin has not been configured");
    }

    return this.transformer;
  }

  private isComponentHtml(filePath: string): boolean {
    if (!filePath.endsWith(".html")) {
      return false;
    }

    const relativePath = relative(this.componentsDirectory, filePath);

    return (
      relativePath !== "" &&
      relativePath !== ".." &&
      !relativePath.startsWith("../") &&
      !relativePath.startsWith("..\\")
    );
  }
}

export function htmlComponentPlugin(options: HtmlComponentPluginOptions = {}): Plugin {
  return new HtmlComponentVitePlugin(options).create();
}
