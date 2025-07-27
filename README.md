# Fictif

[Documentation](https://fictif.gitbook.io/fictif)
[GitHub Repo](https://github.com/fictifhq/fictif)
[NPM Package](https://www.npmjs.com/package/fictif)

## What is Fictif?
Fictif is a full-stack application framework **with 0 runtime dependencies** for building modern, server-driven web apps with Vue 3 — without needing to maintain a separate frontend API. It blends the power of classic server-side tools like Laravel with the speed of SPAs, offering a flexible, composable alternative to Inertia.js, Nuxt, and Vue Router.

Whether you're building Laravel hybrids, Electron apps, PWAs, or fully client-side SPAs, Fictif adapts effortlessly — with zero runtime dependencies and a tiny footprint.

## Features

- **Auto Screen Discovery:** You dont have to import all of your (pages/screens) to use them, all vue files that end with `*.screen.vue`, and are placed in `resources/screens`, are discovered, and defined with a path like this: `path.to.welcome` for `resources/screens/path/to/welcome.screen.vue`, the screen resolver has many other features like node_packages and vendor discovery (`vendor::has.a.screen`) and overrides that i will document later
- **Hybrid by Default:** Get the best of both worlds. Build with server-side routing and controllers, but deliver a seamless, app-like experience to your users, or implement a client-side routing directly to your code.
- **Batteries Included:** Ships with high-quality, unstyled components like `<Display>`, `<Curtain>`, and `<MultiStep>` to accelerate development.
- **Truly Composable API:** A complete suite of Vue 3 composables (useRouter, useForm, useScreens, useHead) that provide a powerful and intuitive developer experience.
- **Minimal Dependencies:** This package has zero runtime dependencies to be bundled with your built code, it uses a single dependency to help with screen resolving. namely `fast-glob` during development only.
- **Written in typescript:** You can understand the usage just by looking at the code, IDE's like vscode will understand the package.
- **Secure & Performant:** A tiny, dependency-free client, build-time route obfuscation, and first-class support for modern web security practices.

## Documentation
Full documentation at [GitBook](https://fictif.gitbook.io/fictif)

## Installation

This package is in its early beta version, we recommend not to use it in production environments, you can install the latest GitHub release:

```bash
pnpm i fictifhq/fictif#release
# or use npm
```

Or get stable releases from npm registry:
```bash
pnpm i fictif
# or use npm
```

## Structure
We came to resolve a big pain-point, how should a vue app be structured?

We recommend all file and folder names to be in lower-case.

Your project structure should look like:
```
resources/
    js/
        app.js
        ... Your javascript files
    css/
        ... Your css files
    layouts/
        ... Your layouts
    components/
        ... Your components
    composables/
        ... Your composables
    screens/
        welcome.screen.vue
        ... Your views ( screens )
```

## Usage

For inertia-like usage, scroll down.

Let's get straight to the point,

Add this to your vite.config.js
```js

export default defineConfig({
    plugins: [
        vue(), // ... and other plugins you already have
        fictif()
    ],
});

```

### `resources/js/app.js`
```js
import { createFictifApp, view } from 'fictif'
import 'fictif/style'

createFictifApp((route) => {
        route.get('/', (req) => {
            return view('welcome').with({
                // You can pass props here
                abcd: '2025'
            })
        });

        route.get('/:someArg', (req, someArg) => {
            return view('welcome').with({
                abcd: someArg
            })
        });

        // This is how to handle 404
        //route.get('*', (req, arg1) => {
        //    //
        //});
    });
```

### `resources/screens/welcome.screen.vue`
```vue
<template>
    Hello {{ abcd }}
</template>

<script>
    const { abcd } = defineProps(['abcd']);
</script>
```

That's all 🧨

## Inertia-like Usage
If you have an Inertiajs compatible backend, like laravel with inertia installed, do this in your `app.js`
```js
import { createFictifApp } from 'fictif'
import 'fictif/style'

createFictifApp();

// Theres plenty of things to customize, don't worry, i will document all of them soon.
```

Yep, thats all, you can define your screens in `resources/screens`, dont forget to add the `fictif()` vite plugin.


## Core Concepts
### useRouter() & Events
The router is the heart of Fictif. It manages the visit lifecycle with a granular event system.

```js
import { useRouter } from 'fictif';

const router = useRouter(); // Get the globally initialized router

router.path; // Current visited path

// Listen to lifecycle events
router.on('leaving', () => {
    if (hasUnsavedChanges()) {
        if (!confirm("Leave without saving?")) {
            router.preventNavigation();
        }
    }
});

router.on('navigation', () => progress.start());
router.on('navigated', () => progress.finish());
router.on('push', ({ page }) => {
    // The page state has been updated
    console.log('Now on component:', page.component);
});

// Programmatic navigation
router.visit('/dashboard');
```


### useForm()

The useForm composable provides a complete solution for form submissions, including state management, validation errors, and file uploads.

```vue
<script setup>
import { useForm } from 'fictif';

const form = useForm({
    name: 'John Doe',
    avatar: null,
});

const submit = () => {
    // This automatically handles FormData for file uploads
    form.post('/users');
};
</script>

<template>
  <form @submit.prevent="submit">
    <input type="text" v-model="form.name">
    <div v-if="form.errors.name">{{ form.errors.name }}</div>

    <input type="file" @input="form.avatar = $event.target.files[0]">

    <button type="submit" :disabled="form.processing">Save</button>
  </form>
</template>
```

## Help
We have a [Discord](https://discord.gg/s7Rg4DHuej) server in case you have any questions.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License
Fictif is open-source software licensed under the MIT license.