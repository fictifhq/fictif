import { Component } from 'vue';
type ScreenComponent = Component;
interface ScreenResolver {
    resolve: (name: string) => Promise<ScreenComponent>;
    has: (name: string) => boolean;
    list: () => string[];
}
/**
 * Provides access to the Fictif screen resolver.
 */
export declare function useScreens(): ScreenResolver;
export {};
//# sourceMappingURL=screens.d.ts.map