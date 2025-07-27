// src/client/composables/screens.ts

// @ts-ignore
import { screens, nameToId } from 'virtual:fictif-screens-data';
import type { Component } from 'vue';

type ScreenComponent = Component;

interface ScreenResolver {
    resolve: (name: string) => Promise<ScreenComponent>;
    has: (name: string) => boolean;
    list: () => string[];
}

let resolverInstance: ScreenResolver | null = null;

function createScreenResolver(): ScreenResolver {
    const isProd = true;

    function getScreenId(name: string): string {
        // In dev, names are the keys. In prod, we look up the obfuscated ID.
        return isProd ? (nameToId as Record<string, string>)[name] || name : name;
    }

    async function resolve(name: string | object): Promise<ScreenComponent> {
        if(typeof name == 'object') return name as ScreenComponent;

        const id = getScreenId(name);
        const loader = (screens as Record<string, () => Promise<{ default: ScreenComponent }>>)[id];

        if (!loader) {
            const available = Object.keys(nameToId);
            console.error(`[Fictif] Screen not found: "${name}" with id: "${id}".`);
            throw new Error(`Screen not found: ${name}`);
        }

        const module = await loader();
        return module.default;
    }

    function has(name: string): boolean {
        const id = getScreenId(name);
        return id in screens;
    }

    function list(): string[] {
        return Object.keys(nameToId);
    }

    return { resolve, has, list };
}

/**
 * Provides access to the Fictif screen resolver.
 */
export function useScreens(): ScreenResolver {
    if (!resolverInstance) {
        resolverInstance = createScreenResolver();
    }
    return resolverInstance;
}