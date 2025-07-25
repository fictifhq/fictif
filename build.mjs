import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build, mergeConfig } from 'vite'
import dts from 'vite-plugin-dts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const sharedConfig = {
  build: {
    target: 'esnext',
    cssCodeSplit: false,
    lib: {
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: ({ name }) => '[name].[ext]',
        exports: 'named',
      },
    },
  },
  plugins: [
    vue(),
  ],
}

const builds = [
  {
    name: 'client',
    entry: path.resolve(__dirname, 'src/client/index.ts'),
    outDir: path.resolve(__dirname, 'dist/client'),
    external: ['vue', 'virtual:fictif-screens-data'],
  },
  {
    name: 'plugin',
    entry: path.resolve(__dirname, 'src/plugin/index.ts'),
    outDir: path.resolve(__dirname, 'dist/plugin'),
    external: ['fast-glob', 'node:path'],
  },
]

for (const { name, entry, outDir, external } of builds) {
  console.log(`#### Building ${name}...`)

  await build(
    mergeConfig(sharedConfig, {
      build: {
        lib: {
          entry,
          fileName: (format, entryName) => `${entryName}.js`,
        },
        outDir,
        rollupOptions: {
          external,
        },
      },
      plugins: [
        dts({
          insertTypesEntry: true,
          outputDir: outDir, // 👈 Emit .d.ts into the same dist folder
          include: ['src/' + name],
          cleanVueFileName: false,
        }),
      ],
    })
  )
}
