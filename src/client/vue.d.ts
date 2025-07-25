// src/plugin/vue.d.ts

// A shim to make the build step easier

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
