export interface HtmlComponentTransformerOptions {
    componentsDirectory: string;
}
export declare class HtmlComponentTransformer {
    private readonly componentsDirectory;
    constructor(options: HtmlComponentTransformerOptions);
    transform(html: string): Promise<string>;
    private expand;
    private resolveComponentPath;
    private readComponent;
}
