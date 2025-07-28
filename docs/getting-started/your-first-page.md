# Your First Page

With Fictif installed and configured, let's create your first page. This involves two main components: a **Layout** and a **Screen**.

*   **Screen:** The core content of a specific page (e.g., a dashboard, a user profile).
*   **Layout:** A reusable wrapper component that contains shared UI like a header, navigation, and footer. The screen is rendered inside the layout.

### 1. Create a Layout Component

Layouts are standard Vue components. Create a new file at `resources/layouts/app-layout.vue`.

This component will define the persistent structure of your application and must include a `<slot />` where the active screen will be rendered.

```vue
<!-- resources/layouts/app-layout.vue -->
<script setup>
// Import the Curtain component for loading indicators
import { Curtain } from 'fictif';
</script>

<template>
  <div class="app-wrapper">
    <header class="main-header">
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>

    <main>
      <!-- The current screen component will be rendered here -->
      <slot />
    </main>

    <footer class="main-footer">
      <p>&copy; 2024 My Awesome App</p>
    </footer>

    <!-- The Curtain component enables global loading indicators -->
    <Curtain />
  </div>
</template>
```

### 2. Create a Screen Component

Screens are special Vue components that live in the `resources/screens` directory and **must** have a filename ending in `.screen.vue`. This convention allows the Fictif plugin to discover them automatically.

Let's create a home page at `resources/screens/home.screen.vue`.

```vue
<!-- resources/screens/home.screen.vue -->
<script setup>
// 1. Import your layout component
import AppLayout from '../layouts/app-layout.vue';
import { Head } from 'fictif';

// 2. Use defineOptions to apply the layout to this screen
defineOptions({
  layout: AppLayout
});

// 3. Define the props that this page expects from the server
defineProps({
  user: Object, // e.g., { name: 'John Doe' }
});
</script>

<template>
  <div>
    <!-- The Head component is globally available for managing SEO -->
    <Head>
      <title>Home Page</title>
      <meta name="description" content="Welcome to our awesome application." />
    </Head>

    <h1 class="welcome-title">
      Welcome, {{ user.name }}!
    </h1>
    <p>This is your application's home page.</p>
  </div>
</template>
```

### 3. Set Up the Backend Response

The final step is to tell your backend to render this screen when a user visits the `/` URL.

In your backend's primary route file, create a route for `/` that returns an Inertia/Fictif response.

Here is an example for a Laravel application:

```php
// routes/web.php (Laravel Example)
use Inertia\Inertia; // Or your framework's equivalent

Route::get('/', function () {
    return Inertia::render('home', [ // 'home' matches 'home.screen.vue'
        'user' => [
            'name' => 'John Doe',
        ],
    ]);
});
```

Now, when you visit your application's root URL, Fictif will:
1.  Receive the instruction to render the `home` screen.
2.  Pass the `user` object as a prop.
3.  Wrap the `home` screen inside the `AppLayout`.
4.  Display the final page to the user.

Congratulations, you've just built your first page with Fictif!