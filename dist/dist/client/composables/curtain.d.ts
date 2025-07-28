export interface InspirationalMessage {
    message: string;
    background: string;
}
export type CurtainMode = 'full' | 'light';
export interface CurtainOptions {
    inspirationalMessages: InspirationalMessage[];
}
export interface StartOptions {
    mode?: CurtainMode;
    customMessage?: string;
    customBackground?: string;
}
export declare const defaults: CurtainOptions;
interface CurtainState {
    isVisible: boolean;
    mode: CurtainMode;
    message: string;
    background: string;
}
type Listener = (state: Readonly<CurtainState>) => void;
interface CurtainManager {
    readonly state: Readonly<CurtainState>;
    start: (options?: StartOptions) => void;
    done: () => void;
    subscribe: (listener: Listener) => void;
    unsubscribe: (listener: Listener) => void;
    setCurtainMounted: (isMounted: boolean) => void;
}
/**
 * Provides access to the global Curtain manager.
 */
export declare function useCurtain(): CurtainManager;
/**
 * Optional: Configure the default curtain options.
 * This should be called once when your app initializes.
 */
export declare function configureCurtain(options: Partial<CurtainOptions>): void;
export {};
//# sourceMappingURL=curtain.d.ts.map