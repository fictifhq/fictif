# Deep Dive: The Fictif Plugin

The Fictif Vite plugin is the engine that powers many of the framework's core features. It's a build tool that runs behind the scenes to provide a seamless developer experience, transforming your conventional project structure into a highly optimized single-page application. Understanding how it works is key to mastering Fictif.

### Primary Responsibilities

The plugin has three main jobs:

1.  **Screen Discovery & Manifest Generation:** It scans your project for "Screen" components and creates a manifest that maps a simple name to the component's file path.
2.  **Code Transformation:** It makes small, helpful modifications to your code to enable certain features and reduce boilerplate.
3.  **Development Server Integration:** It hooks into Vite's development server to provide intelligent Hot Module Replacement (HMR).

### 1. Screen Discovery

This is the plugin's most critical function. It enables Fictif's "zero-config" routing by automatically finding all your page components.

#### The Process

*   **Scanning:** By default, the plugin scans the `resources/screens/` directory for any file ending with the `.screen.vue` suffix.
*   **Naming:** It creates a "logical name" for each screen based on its file path relative to the screens directory. Slashes are converted to dots.
    *   `resources/screens/home.screen.vue` → `home`
    *   `resources/screens/users/view-profile.screen.vue` → `users.view-profile`
*   **Manifest Creation:** The plugin generates a "manifest" in memory—a simple map of logical names to dynamic `import()` functions.
    ```javascript
    // A simplified view of the generated manifest
    {
      'home': () => import('/resources/screens/home.screen.vue'),
      'users.view-profile': () => import('/resources/screens/users/view-profile.screen.vue')
    }
    ```
*   **Virtual Module:** This manifest is exposed to your application via a virtual module named `virtual:fictif-screens-data`. The Fictif router and screen resolver use this module to lazy-load the correct component when you call `view('users.view-profile')`.

This process is what allows you to reference pages by a simple string name without ever needing to manually write `import()` statements.

### 2. Code Transformation

The plugin performs one important transformation on all `.screen.vue` files:

**Automatic `inheritAttrs: false`**

It automatically injects `defineOptions({ inheritAttrs: false })` into your `<script setup>` block.

In Fictif, props are often passed from the router to the `Display` component, which then passes them to both the `Layout` and the `Screen`. Without `inheritAttrs: false`, these props (like `user` or `teams`) would be rendered as HTML attributes on the root element of your Screen component (e.g., `<div user="[object Object]">`).

By injecting this option, Fictif ensures this doesn't happen, leading to cleaner HTML and preventing unexpected behavior. If you have your own `defineOptions` block, it will intelligently merge the property in. If you explicitly set `inheritAttrs` yourself, your setting will be respected.

### 3. HMR & Development

During development (`npm run dev`), the plugin watches your `screens` directory.

*   **When you add or delete a `.screen.vue` file:** The plugin detects the change, rebuilds the screen manifest in the background, and triggers a full-page reload. This ensures the router always has an up-to-date list of available pages.
*   **When you edit an existing screen:** Standard Vite HMR takes over, providing instantaneous updates without a page reload.

### Customizing the Plugin

While the defaults are designed to work for most projects, you can customize the plugin's behavior via your `vite.config.ts`. The most common reason to do this is to add **Screen Namespaces** for modular applications or packages.

For more details on configuration options, see the [Plugin Configuration](../reference/plugin-api.md) reference.