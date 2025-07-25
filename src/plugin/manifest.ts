// src/plugin/manifest.ts

import path from 'node:path';
import fg from 'fast-glob';
import type { ResolvedFictifOptions, ScreenDefinition, ScreenManifest } from './types.js';

const SCREEN_SUFFIX = '.screen.vue';

function cyrb53(str: string, seed = 0): string {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    const hash = 4294967296 * (2097151 & h2) + (h1 >>> 0);
    return `f_${hash.toString(16)}`;
}

function normalizePath(p: string): string {
    return p.replace(/\\/g, '/');
}

export async function buildScreenManifest(options: ResolvedFictifOptions): Promise<ScreenManifest> {
    const manifest: ScreenManifest = new Map();
    if (options.screens === false) {
        return manifest;
    }

    const { root, screens } = options;
    const { namespaces, globNamespaces } = screens;

    const globPatterns: string[] = [];

    if (globNamespaces) {
        globNamespaces.forEach(async baseDir => {

            const packages = await fg(
                normalizePath(path.join(baseDir, '/**/resources/screens')),
                { cwd: root, onlyDirectories: true, absolute: true }
            );
            packages.forEach(pkgScreensDir => {
                globPatterns.push(normalizePath(path.join(pkgScreensDir, `**/*${SCREEN_SUFFIX}`)));
            });
        });
    }

    for (const [ns, nsValue] of Object.entries(namespaces)) {
        const nsPaths = Array.isArray(nsValue) ? nsValue : [nsValue];
        nsPaths.forEach(p => {
            if (p.includes('*')) {
                globPatterns.push(normalizePath(path.join(root, p)));
            }
            else if (p.includes(':')) {
                const [filePath, alias] = p.split(':');
                const absolutePath = path.resolve(root, filePath);
                const finalLogicalName = ns === '@' ? alias : `${ns}::${alias}`;
                manifest.set(finalLogicalName, {
                    absolutePath: normalizePath(`/${path.relative(root, absolutePath)}`),
                    logicalName: finalLogicalName,
                    obfuscatedId: cyrb53(finalLogicalName),
                    namespace: ns,
                });
            }
            else {
                // FIX: Used 'p' instead of the undefined 'filePath'
                const absolutePath = path.resolve(root, p);
                const alias = path.basename(p, SCREEN_SUFFIX);
                const finalLogicalName = ns === '@' ? alias : `${ns}::${alias}`;
                 manifest.set(finalLogicalName, {
                    absolutePath: normalizePath(`/${path.relative(root, absolutePath)}`),
                    logicalName: finalLogicalName,
                    obfuscatedId: cyrb53(finalLogicalName),
                    namespace: ns,
                });
            }
        });
    }

     const screenFiles = await fg(globPatterns, {
        cwd: root,
        onlyFiles: true,
        absolute: true,
        unique: true
    });

    for (const absolutePath of screenFiles) {
        const normalizedPath = normalizePath(absolutePath);

        let foundNs: string | null = null;
        let nsRootPath: string | null = null;

        for (const [ns, nsValue] of Object.entries(namespaces)) {
             const nsPaths = Array.isArray(nsValue) ? nsValue : [nsValue];
             for (const p of nsPaths) {
                if (p.includes('*')) {
                    const baseDir = p.split('*')[0];
                    if (normalizedPath.startsWith(normalizePath(path.join(root, baseDir)))) {
                        foundNs = ns;
                        nsRootPath = baseDir;
                        break;
                    }
                }
             }
             if (foundNs) break;
        }

        if (!foundNs || !nsRootPath) continue;

        const relativePath = normalizedPath.substring(normalizePath(path.join(root, nsRootPath)).length);
        const logicalName = relativePath.replace(SCREEN_SUFFIX, '').replace(/^\//, '').replace(/\//g, '.');
        const finalLogicalName = foundNs === '@' ? logicalName : `${foundNs}::${logicalName}`;

        if (manifest.has(finalLogicalName)) continue;

        manifest.set(finalLogicalName, {
            absolutePath: normalizePath(`/${path.relative(root, absolutePath)}`),
            logicalName: finalLogicalName,
            obfuscatedId: cyrb53(finalLogicalName),
            namespace: foundNs,
        });
    }

    return manifest;
}

export function generateVirtualScreensModule(manifest: ScreenManifest): string {
    const mapEntries = Array.from(manifest.values()).map(def => {
        const key = def.obfuscatedId;
        return `'${key}': () => import('${def.absolutePath}')`;
    });

    const nameToIdMap = Object.fromEntries(
        Array.from(manifest.values()).map(def => [def.logicalName, def.obfuscatedId])
    );

    return `// Generated by Fictif. DO NOT EDIT.
export const screens = { ${mapEntries.join(',\n  ')} };
export const nameToId = ${JSON.stringify(nameToIdMap)};
`;
}