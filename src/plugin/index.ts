import type { ResolvedConfig, ViteDevServer } from 'vite';
import type { FictifOptions, FictifPlugin, ResolvedFictifOptions, ScreenManifest } from './types.js';
import { buildScreenManifest, generateVirtualScreensModule } from './manifest.js';

const VIRTUAL_SCREENS_ID = 'virtual:fictif-screens-data';
const RESOLVED_VIRTUAL_SCREENS_ID = '\0' + VIRTUAL_SCREENS_ID;

function injectInheritAttrsFalse(code: string): string {
  if (!code.includes('<script setup')) return code;

  const defineOptionsRegex = /defineOptions\s*\(\s*{([\s\S]*?)}\s*\)/;

  if (defineOptionsRegex.test(code)) {
    // Already has defineOptions — try merging into it
    return code.replace(defineOptionsRegex, (match, content) => {
      // If it already contains inheritAttrs, leave it alone
      if (/inheritAttrs\s*:/.test(content)) return match;

      // Else, inject inheritAttrs: false
      const newContent = content.trim().endsWith(',')
        ? `${content} inheritAttrs: false`
        : `${content}, inheritAttrs: false`;

      return `defineOptions({${newContent}})`;
    });
  } else {
    // No defineOptions present — inject a new one after <script setup>
    return code.replace(
      /<script setup(.*?)>/,
      `<script setup$1>\ndefineOptions({ inheritAttrs: false });`
    );
  }
}

export default function fictif(userOptions: FictifOptions = {}): FictifPlugin {
  let config: ResolvedConfig;
  let manifest: ScreenManifest;
  let options: ResolvedFictifOptions;

  let rebuildTimeout: NodeJS.Timeout | null = null;
  let rebuildInProgress = false;

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
    }, 10);
  }

  return {
    name: 'vite-plugin-fictif',
    enforce: 'pre',
    api: { getManifest: () => manifest },

    config(config) {
      config.optimizeDeps ??= {};
      config.optimizeDeps.exclude ??= [];
      if (!config.optimizeDeps.exclude.includes(VIRTUAL_SCREENS_ID)) {
        config.optimizeDeps.exclude.push(VIRTUAL_SCREENS_ID);
      }
    },

    configResolved(_config) {
      config = _config;
      const root = config.root;

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
    },

    buildStart() {
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
      if (id.includes('node_modules') || id.startsWith('\0')) return;
      if (!id.endsWith('.screen.vue')) return;
      if (!code.includes('<script setup')) return;

      // Inject or merge defineOptions({ inheritAttrs: false })
      const transformed = injectInheritAttrsFalse(code);
      return { code: transformed, map: null };
    },
  };
}
