import type { Plugin } from "vite";
export interface HtmlComponentPluginOptions {
    componentsDirectory?: string;
}
export declare class HtmlComponentVitePlugin {
    private readonly options;
    private componentsDirectory;
    private transformer;
    constructor(options?: HtmlComponentPluginOptions);
    create(): Plugin;
    private configure;
    private configureServer;
    private getTransformer;
    private isComponentHtml;
}
export declare function htmlComponentPlugin(options?: HtmlComponentPluginOptions): Plugin;
