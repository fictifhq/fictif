// src/plugin/index.ts

import type { ResolvedConfig, ViteDevServer } from 'vite';
import type { FictifOptions, FictifPlugin, ResolvedFictifOptions, ScreenManifest } from './types.js';
import { buildScreenManifest, generateVirtualScreensModule } from './manifest.js';

const VIRTUAL_SCREENS_ID = 'virtual:fictif-screens-data';
const RESOLVED_VIRTUAL_SCREENS_ID = '\0' + VIRTUAL_SCREENS_ID;

export default function fictif(userOptions: FictifOptions = {}): FictifPlugin {
  let config: ResolvedConfig;
  let manifest: ScreenManifest;
  let options: ResolvedFictifOptions;

  // Debounce/rebuild control
  let rebuildTimeout: NodeJS.Timeout | null = null;
  let rebuildInProgress = false;

  /**
   * Schedule an async rebuild of the screen manifest with minimal delay.
   */
  function scheduleManifestRebuild(server: ViteDevServer) {
    if (rebuildInProgress) return;
    if (rebuildTimeout) clearTimeout(rebuildTimeout);

    rebuildTimeout = setTimeout(async () => {
      rebuildInProgress = true;
      try {
        manifest = await buildScreenManifest(options);

        const module = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_SCREENS_ID);
        if (module) {
          server.moduleGraph.invalidateModule(module);
          server.ws.send({ type: 'full-reload' });
        }
      } catch (err) {
        console.error('[Fictif] Failed to rebuild manifest:', err);
      } finally {
        rebuildInProgress = false;
      }
    }, 10); // 10ms debounce for rapid file changes
  }

  return {
    name: 'vite-plugin-fictif',
    enforce: 'pre',
    api: { getManifest: () => manifest },

    configResolved(_config) {
      config = _config;
      const root = config.root;

      // Resolve user options
      let screensOptions: ResolvedFictifOptions['screens'];
      if (userOptions.screens === false) {
        screensOptions = false;
      } else {
        let globNamespaces: string[] | false;
        if (userOptions.screens?.globNamespaces === false) {
          globNamespaces = false;
        } else if (Array.isArray(userOptions.screens?.globNamespaces)) {
          globNamespaces = userOptions.screens.globNamespaces;
        } else {
          globNamespaces = ['./vendor', './packages', './node_modules'];
        }

        screensOptions = {
          namespaces: {
            '@': 'resources/screens/**',
            ...userOptions.screens?.namespaces,
          },
          globNamespaces,
        };
      }

      options = { root, screens: screensOptions };
    },

    configureServer(server) {
      const { watcher } = server;
      const isScreenFile = (file: string) =>
        options.screens !== false && file.endsWith('.screen.vue');

      const onChange = (file: string) => {
        if (isScreenFile(file)) {
          console.log(`[Fictif] Screen change detected: ${file}`);
          scheduleManifestRebuild(server);
        }
      };

      watcher.on('add', onChange);
      watcher.on('unlink', onChange);
      watcher.on('change', onChange);
    },

    buildStart() {
      // Initial manifest build (async)
      return buildScreenManifest(options).then((m) => {
        manifest = m;
      });
    },

    resolveId(id) {
      if (id === VIRTUAL_SCREENS_ID) {
        return RESOLVED_VIRTUAL_SCREENS_ID;
      }
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_SCREENS_ID) {
        return generateVirtualScreensModule(manifest);
      }
    },

    transform(code, id) {
      // Only apply transform in build
      if (config.command !== 'build') return;
      if (id.includes('node_modules') || id.startsWith('\0')) return;
      if (!code.includes('screen(') && !code.includes('has(')) return;

      const screenResolveRegex = /(screen|has)\s*\(\s*['"`](.+?)['"`]\s*\)/g;
      let transformed = code;
      let match: RegExpExecArray | null;

      while ((match = screenResolveRegex.exec(code))) {
        const [full, fn, name] = match;
        const def = manifest.get(name);
        if (def) {
          const replacement = `${fn}('${def.obfuscatedId}')`;
          transformed = transformed.replace(full, replacement);
        }
      }

      return { code: transformed, map: null };
    },
  };
}
