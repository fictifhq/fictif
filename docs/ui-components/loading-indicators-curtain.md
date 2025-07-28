# Loading Indicators (Curtain)

**Fictif** includes a global loading indicator system called the **Curtain**. It provides clear visual feedback to the user during asynchronous operations, most notably page navigations. This improves the user experience by showing that the application is busy and preventing accidental clicks while content is loading.

### Features

*   **Zero-Setup Integration:** Automatically hooks into router events to show/hide during page loads.
*   **Two Modes:**
    *   `full`: An elegant, full-screen overlay with a background image and an inspirational message. Ideal for initial page loads.
    *   `light`: A slim, unobtrusive progress bar at the top of the page. Perfect for subsequent, faster page visits.
*   **Customizable:** Override messages and backgrounds for specific actions or configure new defaults globally.

### 1. Setup

If you use the `createFictifApp` helper, skip the whole setup process.

Using the Curtain is incredibly simple. You only need to do one thing.

Add the `<Curtain />` component to your root layout file (e.g., `resources/layouts/app-layout.vue`). This component is renderless by default but listens for global state changes and manages the DOM elements for the indicator when it's active.

```vue
<!-- resources/layouts/app-layout.vue -->
<script setup>
import { Curtain } from 'fictif'; // Curtain is globally available, but importing is good practice
</script>

<template>
  <div class="app-wrapper">
    <header><!-- ... --></header>
    <main>
      <slot />
    </main>
    <footer><!-- ... --></footer>

    <!-- Add the Curtain component here -->
    <Curtain />
  </div>
</template>
```

**That's it!** The `createFictifApp` function automatically connects the Curtain to the router's lifecycle events. A slim progress bar (`light` mode) will now appear on every page navigation.

### 2. Manual Control

For long-running asynchronous tasks that are not page visits (like generating a report), you can control the Curtain manually with the `useCurtain` composable.

```vue
<script setup>
import { useCurtain, useAPI } from 'fictif';

const curtain = useCurtain();
const api = useAPI();

async function generateReport() {
  // Start the full-screen curtain with a custom message
  curtain.start({
    mode: 'full',
    customMessage: 'Generating your annual report, this may take a moment...',
  });

  try {
    await api.post('/reports/generate');
    // ...handle success
  } catch (error) {
    // ...handle error
  } finally {
    // Always ensure you hide the curtain when the process is finished
    curtain.done();
  }
}
</script>
```

### 3. Customization

#### Start Options

The `curtain.start(options)` method accepts an options object to customize its appearance for a specific invocation.

| Option               | Type     | Default             | Description                                                                 |
| -------------------- | -------- | ------------------- | --------------------------------------------------------------------------- |
| `mode`               | `string` | `'light'`           | The type of indicator to show: `'full'` or `'light'`.                         |
| `customMessage`      | `string` | `undefined`         | A specific message to display. (Only applies to `full` mode).               |
| `customBackground`   | `string` | `undefined`         | A URL for a specific background image. (Only applies to `full` mode).       |

#### Global Configuration

You can override the default inspirational messages used in `full` mode by calling `configureCurtain` in your `app.ts` file, before `createFictifApp`.

```typescript
// resources/js/app.ts
import { createFictifApp, configureCurtain } from 'fictif';

configureCurtain({
  inspirationalMessages: [
    {
      message: "Brewing a fresh pot of data...",
      background: "/images/backgrounds/coffee.jpg"
    },
    {
      message: "Aligning the flux capacitors...",
      background: "/images/backgrounds/tech.jpg"
    },
  ]
});

createFictifApp({ /* ... */ });
```