// src/plugin/types.ts

import type { Plugin } from 'vite';

export interface ScreenAutoScanOptions {
    vendor?: boolean;
    packages?: boolean;
    node_modules?: boolean;
}

export type ScreenNamespaceValue = string | string[];

export interface ScreenOptions {
    namespaces?: Record<string, ScreenNamespaceValue>;
    globNamespaces?: string[] | false;
}

export interface FictifOptions {
    screens?: ScreenOptions | false;
}

// Internal, fully resolved options
export type ResolvedFictifOptions = {
    root: string;
    screens: false | {
        namespaces: Record<string, ScreenNamespaceValue>;
        globNamespaces: string[] | false;
    }
}

export interface ScreenDefinition {
    absolutePath: string;
    logicalName: string;
    obfuscatedId: string;
    namespace: string;
}

export type ScreenManifest = Map<string, ScreenDefinition>;

export type FictifPlugin = Plugin & {
    api: {
        getManifest: () => ScreenManifest;
    };
};