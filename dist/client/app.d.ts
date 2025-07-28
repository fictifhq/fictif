import { App as VueApp, Component } from 'vue';
interface FictifAppOptions {
    mountTo?: string | HTMLElement;
    resolve?: (name: string) => Promise<Component>;
    setup?: ({ el, App, }: {
        el: Element;
        App: Component;
    }) => VueApp;
    progress?: false | {
        delay?: number;
    };
    initialData?: string | object | undefined;
    copyInitialData?: boolean;
    isSSR?: boolean;
    appName: string;
}
export declare const FictifVuePlugin: {
    install(app: VueApp): void;
};
export declare function createFictifApp(config?: FictifAppOptions): Promise<void>;
export {};
//# sourceMappingURL=app.d.ts.map