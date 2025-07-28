# Fictif: The Full-Stack Vue Framework

**Build modern, server-driven Single-Page Applications without the complexity of a separate API. Fictif is the bridge between your powerful backend and a beautiful, reactive Vue 3 frontend.**

[GitHub](https://github.com/fictifhq/fictif) · [Full Documentation](https://fictif.gitbook.io/fictif) · [NPM](https://www.npmjs.com/package/fictif) · [Discord](https://discord.gg/s7Rg4DHuej)

---

Fictif is for developers who love the power and simplicity of their backend framework (like Laravel, AdonisJS, or Rails) but want to build a fast, modern, app-like user interface with Vue—without the headache of building and maintaining a REST or GraphQL API.

It combines the best of both worlds: the developer experience of a classic monolith with the seamless user experience of a SPA.

### ✨ Core Features

*   ✅ **Zero-API Architecture:** Let your existing backend controllers and routes drive your UI. Fictif intelligently fetches data and components on demand.
*   ✅ **Out-of-the-Box Forms:** A powerful `useForm` composable that handles data, validation errors, and even file uploads with minimal code.
*   ✅ **Automatic Code-Splitting:** The Fictif Vite plugin automatically discovers your page components (`*.screen.vue`) and splits them into tiny, lazy-loaded chunks. Your app stays fast by default.
*   ✅ **A Complete Toolkit:** Comes with first-class utilities for SEO (`useHead`), data fetching (`useAPI`), and UI (loading indicators, multi-step components).
*   ✅ **Backend Agnostic:** Works seamlessly with any backend framework that can return JSON. If you can use Inertia.js, you can use Fictif.
*   ✅ **Zero Runtime Dependencies:** Fictif has an incredibly small footprint and adds no external dependencies to your final production bundle.

### Installation
To get latest changes ( this is a beta library with frequent updates )
```bash
pnpm i fictifhq/fictif#release
```

If you are looking for stable releases, install the `fictif` package from the npm registry.

```bash
# Using npm
npm install fictif

# Using pnpm
pnpm add fictif
```

### 🚀 Get Started in 2 Minutes

The fastest way to get a full Fictif application running is with an official starter kit. These repositories come pre-configured with everything you need.

> **[➡️ Use the Official Fictif + Laravel Starter Kit](https://github.com/fictifhq/laravel-starter)**
>
> *(More starter kits for NodeJS, Electron, etc., are coming soon!)*

### 👀 See it in Action

Words only go so far. See a real application built with Fictif to understand its power and simplicity.

> **[Live Demo](https://demo.fictif.dev)** (Link to your hosted demo app)
>
> **[Demo Source Code](https://github.com/fictifhq/demo-app)** (Link to the demo's repo)

### 📚 Dive Deeper

Ready to build your own application? Our full documentation has everything you need, from basic setup to advanced concepts.

> **[Read the Full Documentation on GitBook](https://fictif.gitbook.io/fictif/getting-started/what-is-fictif)**

