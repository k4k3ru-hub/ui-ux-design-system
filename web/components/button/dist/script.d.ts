export interface ButtonOptions {
    className?: string;
    document?: Document;
}
export declare class Button {
    #private;
    static readonly defaultButtonClass = "button";
    constructor(options?: ButtonOptions);
    /** Start handling button interactions in the configured document. */
    run(): void;
    /** Remove event listeners registered by run(). */
    destroy(): void;
}
