# Page Navigation & Routing

Routing is the core of how users navigate your application. Fictif provides a powerful and flexible routing system that can operate in two primary modes: **Inertia-driven** (the default for full-stack apps) and **Client-side** (for static or decoupled apps).

### 1. Navigating with Links

Regardless of the routing mode, the primary way users navigate is by clicking links. Fictif automatically enhances standard anchor tags (`<a>`) to provide a smooth, single-page application experience.

```vue
<template>
  <nav>
    <!-- Fictif will intercept this click and perform a client-side visit -->
    <a href="/dashboard">Dashboard</a>

    <!-- This link will cause a full page reload, as it's an external URL -->
    <a href="https://google.com">External Link</a>

    <!-- This will also cause a full page reload -->
    <a href="/dashboard" target="_blank">Open in New Tab</a>
  </nav>
</template>
```

When a user clicks an eligible link, Fictif prevents the browser's default full-page reload and instead makes a "visit" using its internal router.

### 2. Programmatic Navigation

You can also trigger navigation programmatically from your `<script>` block using the `useRouter` composable.

```vue
<script setup>
import { useRouter } from 'fictif';

const router = useRouter();

function goToSettings() {
  router.visit('/settings');
}

function submitAndRedirect() {
  // after a POST request, you might redirect the user
  api.post('/posts', { body: postData }).then(() => {
    router.visit('/posts', {
      // Use 'replace' to avoid adding the form page to browser history
      replace: true
    });
  });
}
</script>
```

The `router.visit(url, options)` method is the heart of navigation. The `options` object can be used to customize the visit.

| Option             | Type        | Description                                                                                           |
| ------------------ | ----------- | ----------------------------------------------------------------------------------------------------- |
| `method`           | `string`    | The HTTP method to use (`'get'`, `'post'`, etc.). Defaults to `'get'`.                                 |
| `body`             | `object`    | An object of data to send with `post`, `put`, or `patch` requests.                                    |
| `replace`          | `boolean`   | If `true`, replaces the current entry in the browser history instead of pushing a new one.            |
| `preserveScroll`   | `boolean`   | If `true`, the page's scroll position will be maintained after the visit.                               |
| `only`             | `string[]`  | An array of prop keys. The server should only return these specific props, for a partial reload.      |

### 3. Routing Modes

#### Inertia-Driven Routing (Default)

This is the standard mode for Fictif. You do not define routes in your frontend code. All routing is handled by your backend (e.g., Laravel, AdonisJS).

*   **How it works:** Fictif makes a request to your server. Your server finds the matching route and returns a [Page Object](./deep-dive/the-inertia-protocol.md) containing the name of the Vue "Screen" component and its props.
*   **When to use it:** This is the recommended approach for building full-stack applications with Fictif. It's simple, powerful, and keeps your logic centralized on the server.
*   **Setup:** No setup is required. Simply call `createFictifApp()` and Fictif will automatically use this mode.

#### Client-Side Routing

In this mode, you define your application's routes directly in your frontend JavaScript, similar to Vue Router.

*   **How it works:** When a user navigates, Fictif looks up the path in your client-side route definitions and renders the corresponding component. This is instantaneous and does not require a network request.
*   **When to use it:** Ideal for static websites, JAMstack applications, or frontends that are completely decoupled from a backend API.
*   **Setup:** You must define and initialize your router using `initRouter()` *before* calling `createFictifApp`.

**Example `app.ts` for Client-Side Routing:**
```typescript
import { createFictifApp, initRouter, view, redirect } from 'fictif';

// 1. Initialize the router first
const router = initRouter();

// 2. Define your client-side routes
router.get('/', () => {
  return view('home').with({ message: 'Welcome!' });
});

router.get('/about', () => {
  return view('about');
});

router.get('*', () => {
  return redirect('/'); // 404 handler
});

// 3. Create the app. Fictif will detect your existing router.
createFictifApp();
```

By supporting both modes, Fictif provides the flexibility to build any kind of web application, from a simple static site to a complex, server-driven monolith.