# Installation & Setup

While we highly recommend starting with one of our [official starter kits](./#get-started-in-2-minutes), you can easily integrate Fictif into an existing project. This guide will walk you through the manual setup process.

### Prerequisites

*   Node.js and a package manager (npm, pnpm, or yarn).
*   A backend application set up with Vite. (e.g., using the Laravel or AdonisJS Vite plugins).
*   Vue 3 installed in your project.

### 1. Project Structure

Fictif's Vite plugin uses a conventional directory structure to automatically discover your page components. Before you begin, ensure your project follows this layout:

```text
/
├── resources/
│   ├── components/       # Your reusable Vue components
│   ├── layouts/          # Page layout components (e.g., app-layout.vue)
│   ├── screens/          # Page components must end in *.screen.vue
│   ├── css/              # Your main stylesheet (e.g., app.css)
│   └── js/               # Your main JavaScript entry point (e.g., app.ts)
└── vite.config.ts        # Vite configuration file
```

### 2. Install Fictif

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

### 3. Configure Vite

Add the `fictif` plugin to your `vite.config.ts` file. It's crucial that this plugin is included, as it handles all the "magic" of screen discovery and code-splitting.

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fictif from 'fictif/plugin' // 1. Import the Fictif plugin

export default defineConfig({
  plugins: [
    vue(),
    // ... any other plugins
    fictif(), // 2. Add the Fictif plugin
  ],
})
```

### 4. Set Up the App Entry Point

This is the main JavaScript file where your application is initialized. Fictif provides a single, powerful function, `createFictifApp`, to handle this for you.

Update your main entry point (e.g., `resources/js/app.ts`) to the following:

```typescript
// resources/js/app.ts

// 1. Import your global stylesheet
import '../css/app.css';

// 2. Import base styles for Fictif's UI components (optional)
import 'fictif/style';

// 3. Import the main Fictif function
import { createFictifApp } from 'fictif';

// 4. Initialize and mount the application
createFictifApp({
  appName: 'My Awesome App', // Used for default <title> tags
});
```

This simple setup automatically:
*   Initializes Fictif's Inertia-compatible router.
*   Reads the initial page data from your backend.
*   Sets up the Head manager for SEO.
*   Wires up the Curtain loading indicator to router events.
*   Mounts the Vue application to the DOM (by default, it looks for an element with `id="app"`).

**That's it!** Your project is now fully configured to use Fictif. The next step is to create your first page.