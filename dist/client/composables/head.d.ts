type OptionsModifier<T> = string | ((value: T | undefined) => string | null | undefined | Record<string, any>);
type LinkValue = string | Record<string, any>;
type ScriptValue = string | Record<string, any>;
export type HeadOptions = {
    title?: (title: string | undefined) => string;
    description?: OptionsModifier<string>;
    favicon?: OptionsModifier<string>;
    httpEquivMeta?: Record<string, OptionsModifier<any>>;
    propertyMeta?: Record<string, OptionsModifier<any>>;
    namedMeta?: Record<string, OptionsModifier<any>>;
    link?: Record<string, LinkValue | LinkValue[]>;
    script?: ScriptValue[];
};
export type HeadUpdateData = Record<string, any> & {
    reset?: boolean;
    title?: string;
    description?: string;
    favicon?: string;
    children?: Record<string, any>[];
};
export declare let globalHead: HeadManager | null;
export declare class HeadManager {
    private options;
    lastData: HeadUpdateData;
    private managedTagKey;
    constructor(options: HeadOptions);
    init(): void;
    update(data: HeadUpdateData): void;
    renderToString(): {
        headTags: string;
        bodyTags: string;
    };
    private _compile;
    private _updateDOM;
    private _renderTagToString;
}
export declare function useHead(options?: HeadOptions): HeadManager;
export declare function createHead(options?: HeadOptions): HeadManager;
export declare function initHead(options?: HeadOptions): HeadManager;
export {};
//# sourceMappingURL=head.d.ts.map