LLM.md -- This file is supposed to be given for LLMs to index, it combines all the documentation, just upload or reference it to an LLM of your choice

<!-- START: README.md -->
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


<!-- END: README.md -->

<!-- START: docs/community/how-to-contribute.md -->
# how to contribute

# How to Contribute

Thank you for your interest in contributing to Fictif! We're thrilled to have you. Community contributions are the lifeblood of an open-source project, and every contribution, no matter how small, is deeply appreciated.

This guide will walk you through the process of contributing to the project.

### Types of Contributions

There are many ways to contribute to Fictif:

*   **Reporting Bugs:** Find a bug? Let us know by [opening an issue](https://github.com/fictifhq/fictif/issues). A detailed report helps us fix it faster.
*   **Suggesting Enhancements:** Have an idea for a new feature or an improvement to an existing one? Start a conversation on [GitHub Discussions](https://github.com/fictifhq/fictif/discussions).
*   **Improving Documentation:** Find a typo, a confusing sentence, or a missing guide? Documentation improvements are one of the easiest and most valuable ways to contribute.
*   **Submitting Code:** Ready to write some code? You can work on an existing bug or add a new feature.

### Your First Code Contribution

Ready to submit a pull request? Here’s how to get your development environment set up.

#### 1. Fork & Clone the Repository

First, fork the main `fictifhq/fictif` repository on GitHub. Then, clone your fork to your local machine.

```bash
git clone https://github.com/YOUR_USERNAME/fictif.git
cd fictif
```

#### 2. Install Dependencies

Fictif uses `pnpm` for workspace management. Install the dependencies for all packages.

```bash
pnpm install
```

#### 3. Run the Development Environment

The repository is a monorepo containing the core Fictif package and potentially a documentation or demo application. You can run the development server to test your changes.

```bash
# This will likely be a command to run the playground or test app
pnpm run dev
```

#### 4. Create a New Branch

Create a new branch for your changes. Use a descriptive name, such as `fix/form-reset-bug` or `feat/add-dark-mode-curtain`.

```bash
git checkout -b your-branch-name
```

#### 5. Make Your Changes

Make your desired code changes. Be sure to follow the existing code style and conventions. If you are adding a new feature, consider adding tests to cover it.

#### 6. Submit a Pull Request

Once you are happy with your changes, commit them and push your branch to your forked repository on GitHub.

```bash
git add .
git commit -m "feat: Add dark mode option to Curtain component"
git push -u origin your-branch-name
```

Finally, go to the main Fictif repository on GitHub and open a pull request. In the PR description, please describe the changes you've made and link to any relevant issues or discussions. A core team member will review your contribution as soon as possible.

Thank you again for helping make Fictif better!


<!-- END: docs/community/how-to-contribute.md -->

<!-- START: docs/community/index.md -->
# index

# Community & Support

Welcome to the Fictif community! We're excited to have you here. Whether you're a new user asking a question, a seasoned developer wanting to contribute, or just curious about the project, this is the place to connect with other Fictif users and the core team.

### Where to Get Help

We have several channels available for you to get help, share your projects, and discuss ideas.

#### 💬 Discord Server

For real-time conversation, Q&A, and sharing what you're building, our Discord server is the best place to be. It's the most active part of our community.

> **[➡️ Join the Official Fictif Discord Server](https://discord.gg/s7Rg4DHuej)**

#### ❔ GitHub Discussions

For longer-form questions, feature requests, or discussions that could benefit from a more threaded, persistent format, please use GitHub Discussions. This is a great place to search for answers to questions that may have already been asked.

> **[➡️ Start a Discussion on GitHub](https://github.com/fictifhq/fictif/discussions)**

#### 🐛 Bug Reports

If you believe you have found a bug in Fictif, please open an issue on our GitHub repository. To help us resolve your issue as quickly as possible, please follow the bug report template and provide as much detail as you can, including a minimal reproduction if possible.

> **[➡️ Report a Bug on GitHub Issues](https://github.com/fictifhq/fictif/issues)**

### How You Can Contribute

Fictif is an open-source project driven by its community. We welcome contributions of all kinds, from code and documentation to bug reports and feature ideas.

To learn more about how you can get involved, please see our [How to Contribute](./how-to-contribute.md) guide.

### Code of Conduct

To ensure our community is a welcoming and inclusive environment for everyone, we have adopted a Code of Conduct that all members are expected to follow. Please take a moment to read it before participating.

> *(Link to your Code of Conduct file would go here)*
<!-- END: docs/community/index.md -->

<!-- START: docs/community/support-and-troubleshooting.md -->
# support and troubleshooting

# Support & Troubleshooting

Encountering an issue? This guide provides solutions to common problems and steps to take when you need help.

### Common Issues

#### "Screen not found: [screen-name]" Error

This is the most common error and usually means the Fictif Vite plugin could not find your screen component. Here's what to check:

1.  **File Suffix:** Ensure your page component file ends with `.screen.vue`. For example, `home.vue` will not be discovered, but `home.screen.vue` will.
2.  **Directory Location:** By default, Fictif only scans the `resources/screens/` directory. Make sure your file is located there.
3.  **Correct Naming:** Check that the name you are using in your code (e.g., `view('user.profile')`) matches the file path (`resources/screens/user/profile.screen.vue`). Slashes in the path become dots in the name.
4.  **Restart Vite:** If you've just added a new file and it's not being picked up, try restarting the Vite development server.

#### `fictif` Commands or Components Are Not Working

*   **Check Plugin Installation:** Ensure the `fictif()` plugin is present in your `vite.config.ts` file. Without it, none of the core features will be enabled.
*   **App Initialization:** Make sure you are calling `createFictifApp()` in your main JavaScript entry point. This function is responsible for setting up all the global components and services.

#### Form Submissions Aren't Working

*   **Check Backend Response:** If your form submission hangs or fails unexpectedly, use your browser's developer tools (Network tab) to inspect the response from your server. A `500` server error on your backend will cause the request to fail.
*   **Validation Errors Not Appearing:** For validation errors to be automatically handled by `useForm`, your server **must** respond with a `422 Unprocessable Entity` status code. The response body should be a JSON object containing an `errors` key.

### Getting Help

If you've checked the common issues above and are still stuck, we're here to help.

1.  **Search First:** Before posting, please search our [GitHub Discussions](https://github.com/fictifhq/fictif/discussions) and open issues to see if your question has already been answered.
2.  **Ask in Discord:** For quick questions and general discussion, the `#help` channel in our [Discord Server](https://discord.gg/s7Rg4DHuej) is the best place to start.
3.  **Start a Discussion:** For more complex problems or questions that aren't bug reports, open a new thread in [GitHub Discussions](https://github.com/fictifhq/fictif/discussions). Provide as much detail as possible, including code snippets and a description of what you're trying to achieve.

When asking for help, please be sure to include:
*   The version of `fictif` you are using.
*   Relevant code snippets.
*   A clear description of the expected behavior vs. the actual behavior.
*   Any error messages you are seeing in your browser console or terminal.

This will help the community understand your issue and provide a solution more quickly
<!-- END: docs/community/support-and-troubleshooting.md -->

<!-- START: docs/core-guides/handling-forms-and-file-uploads.md -->
# handling forms and file uploads

# Handling Forms & File Uploads

Managing form state is a fundamental part of web development, but it often involves tedious boilerplate for handling data, validation errors, submission states, and resets. Fictif's `useForm` composable streamlines this entire process into a single, powerful, and reactive object.

This guide will cover everything from basic form submissions to handling file uploads with progress indicators.

### 1. The Basics: Creating a Form

To get started, import `useForm` into your component and initialize it with an object representing your form's data fields.

The `useForm` composable returns a reactive `form` object. This object holds your data, validation errors, and various state properties like `processing` and `isDirty`. The properties of your initial data object are also exposed on the `form` object directly, making them easy to bind to your inputs with `v-model`.

```vue
<script setup>
import { useForm } from 'fictif';

// Initialize the form with its default fields and values.
const form = useForm({
  name: '',
  email: '',
  password: '',
});

// A function to handle the form submission.
function submit() {
  // Use a helper method like `post` to submit the form.
  // The first argument is the URL, and the second is an options object.
  form.post('/users');
}
</script>

<template>
  <form @submit.prevent="submit">
    <!-- Name Field -->
    <div>
      <label for="name">Name</label>
      <input id="name" type="text" v-model="form.name" />
    </div>

    <!-- Email Field -->
    <div>
      <label for="email">Email</label>
      <input id="email" type="email" v-model="form.email" />
    </div>

    <!-- ... more fields ... -->

    <button type="submit">Create User</button>
  </form>
</template>
```

### 2. Tracking Submission State

The `form` object provides several reactive properties to track the state of a submission. This allows you to provide clear feedback to the user, such as disabling the submit button or showing a success message.

*   `form.processing`: A boolean `Ref` that is `true` while the form is being submitted to the server.
*   `form.wasSuccessful`: A boolean `Ref` that becomes `true` after a successful submission. It remains `true` until the form data is changed again.
*   `form.recentlySuccessful`: A boolean `Ref` that becomes `true` for a short period (default: 2 seconds) after a successful submission. This is perfect for temporary "Saved!" messages.

```vue
<template>
  <form @submit.prevent="submit">
    <!-- ... form fields ... -->

    <!-- Disable the button while processing -->
    <button type="submit" :disabled="form.processing">
      {{ form.processing ? 'Saving...' : 'Create User' }}
    </button>

    <!-- Show a temporary success message -->
    <Transition name="fade">
      <div v-if="form.recentlySuccessful" class="success-message">
        User created successfully!
      </div>
    </Transition>
  </form>
</template>
```

### 3. Handling Validation Errors

A key feature of `useForm` is its automatic handling of validation errors from the server.

When you submit a form and your backend responds with a `422 Unprocessable Entity` status code and a JSON body containing errors, Fictif will automatically populate the `form.errors` object.

**Server Response Example (422):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": "The email has already been taken.",
    "password": "The password must be at least 8 characters."
  }
}
```

The `form` object will automatically catch this and update its state. You can then easily display these errors next to their corresponding fields.

*   `form.errors`: A reactive object where keys are field names and values are the error messages.
*   `form.hasErrors`: A computed boolean `Ref` that is `true` if the `errors` object contains any errors.

```vue
<template>
  <form @submit.prevent="submit">
    <div>
      <label for="email">Email</label>
      <input id="email" type="email" v-model="form.email" />

      <!-- Display the error message if it exists -->
      <div v-if="form.errors.email" class="error-text">
        {{ form.errors.email }}
      </div>
    </div>

    <!-- ... more fields ... -->
  </form>
</template>
```

The `form.errors` object is automatically cleared on the next form submission. You can also clear errors manually using `form.clearErrors()`.

### 4. File Uploads & Progress

Fictif makes handling file uploads, which are notoriously difficult in SPAs, incredibly simple. When `useForm` detects a `File` object in its data, it automatically constructs a `multipart/form-data` request.

You can monitor the upload progress using the `form.progress` property.

*   `form.progress`: A reactive property that becomes an object (`{ percentage: number }`) during a file upload. It is `null` at all other times.

```vue
<script setup>
import { useForm } from 'fictif';

const form = useForm({
  name: 'My Vacation Video',
  attachment: null, // This will hold the File object
});

function handleFileSelect(event) {
  // Assign the selected file to the form data
  form.attachment = event.target.files[0];
}

function submit() {
  form.post('/videos');
}
</script>

<template>
  <form @submit.prevent="submit">
    <input type="text" v-model="form.name" />
    <input type="file" @change="handleFileSelect" />

    <!-- Progress Bar -->
    <div v-if="form.progress" class="progress-container">
      <div
        class="progress-bar"
        :style="{ width: form.progress.percentage + '%' }"
      ></div>
      <span>{{ form.progress.percentage }}%</span>
    </div>

    <button type="submit" :disabled="form.processing">Upload</button>
  </form>
</template>
```

### 5. Advanced Control

The `form` object provides several helper methods and options for more advanced control.

#### Lifecycle Callbacks

The submission methods (`post`, `put`, etc.) accept a second argument, an `options` object, where you can define lifecycle callbacks.

```javascript
form.post('/users', {
  // Runs as soon as submission starts
  onStart: () => console.log('Starting submission...'),

  // Runs on a successful (2xx) response
  onSuccess: (page) => console.log('Success! Page props:', page.props),

  // Runs on a validation error (422) response
  onError: (errors) => console.log('Validation failed:', errors),

  // Runs after the submission is complete, regardless of success or failure
  onFinish: () => console.log('Submission finished.'),

  // Runs periodically during file uploads
  onProgress: (progress) => console.log(`Progress: ${progress.percentage}%`),
});
```

#### Helper Methods

*   `form.reset(...fields?)`: Resets the form data back to its initial state. If field names are provided (e.g., `form.reset('password', 'password_confirmation')`), only those fields are reset.
*   `form.clearErrors(...fields?)`: Clears validation errors. If field names are provided, only those errors are cleared.
*   `form.setData(key, value)`: A programmatic way to set a form field's value. Useful for custom inputs.

#### `transform` option

If you need to modify the form data just before it's sent to the server, you can use the `transform` option when creating the form.

```javascript
// Only send specific fields, even if the form object contains more data.
const form = useForm({
  email: 'test@example.com',
  password: 'password123',
  rememberMe: true, // This field will not be sent
}, {
  transform: (data) => ({
    email: data.email,
    password: data.password,
  }),
});
<!-- END: docs/core-guides/handling-forms-and-file-uploads.md -->

<!-- START: docs/core-guides/making-api-requests.md -->
# making api requests

# Making API Requests

While Fictif's primary strength is its "Zero-API" architecture for page navigation, most complex applications still need to communicate with a server to fetch data asynchronously or perform actions without a full page visit. For this, Fictif includes a powerful, isomorphic HTTP client built on the native `fetch` API.

It's a modern, feature-rich alternative to libraries like Axios, designed to work seamlessly on both the client and server.

### 1. Global Configuration

It's best practice to configure a global API instance in your application's entry point. This allows you to define a `baseUrl`, default headers, and other cross-cutting concerns in one place.

```typescript
// resources/js/app.ts
import { createFictifApp, initAPI } from 'fictif';

// Initialize the global API instance before creating the app.
initAPI({
  baseUrl: 'https://api.example.com/v1',

  // Default headers to send with every request.
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    // Header values can be dynamic functions, perfect for auth tokens.
    'Authorization': () => {
      const token = localStorage.getItem('authToken');
      return token ? `Bearer ${token}` : '';
    }
  },

  // Default timeout for all requests (in milliseconds).
  timeout: 10000,
});

createFictifApp({ /* ... */ });
```

### 2. Making Requests with `useAPI`

Once configured, you can use the `useAPI` composable anywhere in your application to get the global instance and make requests. It provides methods for all common HTTP verbs: `get`, `post`, `put`, `patch`, and `delete`.

These methods are promise-based and automatically parse the JSON response body, returning the data directly.

**Example: Fetching Data in a Component**

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { useAPI } from 'fictif';

const api = useAPI(); // Get the global instance
const products = ref([]);
const isLoading = ref(true);

async function fetchProducts() {
  try {
    // Makes a GET request to `https://api.example.com/v1/products`
    const data = await api.get('/products');
    products.value = data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchProducts);
</script>
```

**Example: Sending Data with a POST Request**

```javascript
import { useAPI } from 'fictif';
const api = useAPI();

async function createProduct(productData) {
  try {
    // The `body` will be automatically stringified to JSON.
    const newProduct = await api.post('/products', {
      body: productData
    });
    console.log('Product created:', newProduct);
    return newProduct;
  } catch (error) {
    // The error object is enhanced with response details.
    console.error('Validation errors:', error.data); // e.g., { errors: { name: 'is required' } }
    throw error;
  }
}
```

### 3. Core Features

Fictif's API client comes with many powerful features out of the box.

#### Automatic Retries

By default, requests that fail with a server error (status code >= 500) or a network error will be automatically retried up to 3 times with an increasing delay. This helps make your application more resilient to temporary network issues. You can customize this behavior globally or per-request.

```javascript
// Retry a specific request up to 5 times
api.get('/flaky-endpoint', {
  retries: 5,
});
```

#### Request Deduplication

If you make the same `GET` request multiple times in quick succession (e.g., from a fast-typing user in a search box), Fictif will automatically cancel the previous identical requests and only resolve the latest one. This prevents race conditions and saves bandwidth. This is enabled by default.

#### Response Caching

You can easily cache `GET` request responses on the client to provide an instantaneous experience when the same data is requested again.

```javascript
// Cache the response from this endpoint for 60 seconds.
api.get('/configuration', {
  cacheTtl: 60000 // Time-to-live in milliseconds
});

// The first time this is called, it makes a network request.
// If called again within 60s, it will return the cached data instantly.
```

### 4. Advanced: Hooks (Interceptors)

For complex scenarios like automatic token refreshing, you can use hooks to tap into the lifecycle of every request.

*   `before(request)`: Runs before a request is sent.
*   `after(response, data)`: Runs after a successful response.
*   `onError(error, attempt)`: Runs when a request fails.

**Example: Auto-Refreshing an Expired Auth Token**

This advanced example shows how to use `onError` to transparently handle expired authentication tokens.

```typescript
// In your initAPI() configuration
initAPI({
  // ... other options
  onError: [
    async (error, attempt, options) => {
      // Check if it's a 401 Unauthorized error and we haven't already tried refreshing.
      if (error.response?.status === 401 && !options._isRetrying) {
        try {
          // Use a clean API instance for the refresh call to avoid loops.
          const refreshApi = useAPI({ inheritOptions: false });
          const { new_token } = await refreshApi.post('/auth/refresh-token');

          // Store the new token. The `Authorization` header function will pick it up.
          localStorage.setItem('authToken', new_token);

          // Retry the original request that failed.
          // Fictif is smart enough to re-run the request with the new token.
          options._isRetrying = true;
          return api.request(error.request.url, options);

        } catch (refreshError) {
          // If refreshing fails, log out the user.
          // window.location.href = '/login';
          return false; // Stop retrying the original request.
        }
      }
    }
  ]
});
```
<!-- END: docs/core-guides/making-api-requests.md -->

<!-- START: docs/core-guides/managing-seo-and-meta-tags.md -->
# managing seo and meta tags

# Managing SEO & Meta Tags

Properly managing your document's `<head>` section is crucial for Search Engine Optimization (SEO) and social media sharing. Fictif provides a comprehensive and reactive system for controlling your page titles, meta tags, and other head elements directly from your Vue components.

### 1. The `<Head>` Component

The easiest way to manage head tags is with the declarative `<Head>` component. This component is **globally available** after you set up Fictif, so you don't need to import it.

You can place it in any of your Screen or Layout components. It is **renderless**, meaning it doesn't output any HTML where it's placed; instead, it communicates with a central manager to update the document's actual `<head>`.

```vue
<!-- resources/screens/about.screen.vue -->
<script setup>
  // No import needed for <Head>!
</script>

<template>
  <div>
    <Head>
      <title>About Our Company</title>
      <meta name="description" content="Learn about our mission, values, and the team behind our success." />

      <!-- Open Graph tags for social media sharing -->
      <meta property="og:title" content="About Our Company" />
      <meta property="og:description" content="Learn about our mission and values." />
      <meta property="og:image" content="https://example.com/images/about-us-social.png" />
    </Head>

    <h1>About Us</h1>
    <p>This is the about page content.</p>
  </div>
</template>
```

When this component is mounted, Fictif will add these tags to the document's `<head>`. When you navigate to another page and this component is unmounted, these tags are automatically removed.

### 2. Global Configuration & Title Templates

Repeating the same site name in every `<title>` tag is tedious. Fictif allows you to define global templates and fallbacks during initialization. This is done in your main entrypoint file.

In `createFictifApp`, you can pass a `head` configuration object.

```typescript
// resources/js/app.ts
import { createFictifApp, initHead } from 'fictif';

// For more advanced config:

initHead({
    title: (pageTitle) => {
      return pageTitle ? `${pageTitle} - Fictif Inc.` : 'Fictif Inc. | The Future of Web Dev';
    },

    // You can also set global defaults for other meta tags.
    // These will be used if a page doesn't provide its own.
    namedMeta: {
      'twitter:card': 'summary_large_image',
    },
    propertyMeta: {
      'og:site_name': 'Fictif Inc.',
    }
});

createFictifApp({
  appName: 'Fictif Inc.', // This is a shortcut for a basic title template
});
```

With this configuration:
*   A page with `<Head><title>Contact</title></Head>` will result in a final document title of `"Contact - Fictif Inc."`.
*   A page with no `<title>` tag will fall back to `"Fictif Inc. | The Future of Web Dev"`.
*   The `og:site_name` meta tag will be present on every page.

### 3. Programmatic Control with `useHead`

For dynamic scenarios where you need to update meta tags based on data fetched from an API, you can use the `useHead` composable. It gives you direct access to the head manager's `update` method.

This is perfect for product pages, blog posts, or user profiles.

```vue
<!-- resources/screens/posts/show.screen.vue -->
<script setup>
import { watch } from 'vue';
import { useHead } from 'fictif';

const props = defineProps({
  post: Object, // e.g., { title: 'My First Post', excerpt: '...', image: '...' }
});

const head = useHead();

// Watch for changes to the post prop and update the head tags
watch(() => props.post, (newPost) => {
  if (newPost) {
    head.update({
      title: newPost.title,
      description: newPost.excerpt, // Will create <meta name="description" ...>

      // Keys matching `propertyMeta` configs will be handled correctly
      'og:title': newPost.title,
      'og:image': newPost.imageUrl,
    });
  }
}, { immediate: true }); // `immediate` ensures it runs on initial load

</script>

<template>
  <article>
    <h1>{{ post.title }}</h1>
    <p>{{ post.content }}</p>
  </article>
</template>
```

### 4. Advanced Tags

The `<Head>` component can accept any valid HTML head element, including `<link>` for stylesheets or canonical URLs, and `<script>` for JSON-LD structured data or third-party scripts.

To place a script in the `<body>` instead of the `<head>`, add the boolean `body` attribute.

```vue
<template>
  <Head>
    <title>Advanced Page</title>

    <!-- A canonical link to prevent duplicate content issues -->
    <link rel="canonical" href="https://example.com/advanced" />

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">

    <!-- JSON-LD for Rich Snippets -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Advanced Fictif Techniques",
        "author": { "@type": "Person", "name": "John Doe" }
      }
    </script>

    <!-- A third-party script placed at the end of <body> -->
    <script src="https://example.com/analytics.js" defer body></script>
  </Head>

  <!-- ... page content ... -->
</template>
<!-- END: docs/core-guides/managing-seo-and-meta-tags.md -->

<!-- START: docs/core-guides/page-navigation-and-routing.md -->
# page navigation and routing

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
<!-- END: docs/core-guides/page-navigation-and-routing.md -->

<!-- START: docs/deep-dive/advanced-routing.md -->
# advanced routing

# Deep Dive: Advanced Routing

Fictif's router is built on an expressive and powerful middleware-based system inspired by backend frameworks like Express and Laravel. While the basics are simple, you can leverage its advanced features to handle complex application logic, organize your routes cleanly, and even create hybrid applications.

### 1. Route Groups

As your application grows, you may find yourself repeating prefixes or middleware for a set of related routes. Route groups allow you to apply common attributes to multiple routes in a clean, DRY (Don't Repeat Yourself) way.

```typescript
// In a client-side routing setup
import { initRouter, view } from 'fictif';

const router = initRouter();

// Define a group for all admin-panel routes
router.group((admin) => {
  admin.prefix('/admin'); // All routes in this group will start with /admin
  admin.name('admin.');   // All named routes will be prefixed with 'admin.'
  // admin.applyMiddleware('auth'); // You can apply middleware too (see below)

  admin.get('/dashboard', () => { // Final path: /admin/dashboard
    return view('admin/dashboard');
  }).name('dashboard'); // Final name: 'admin.dashboard'

  admin.get('/users', () => { // Final path: /admin/users
    return view('admin/users/index');
  }).name('users.index'); // Final name: 'admin.users.index'
});
```

### 2. Middleware

Middleware are functions that run before your final route handler. They are perfect for cross-cutting concerns like authentication, logging, or data pre-fetching.

A middleware function receives the `request` object and a `next` function. It must call `next(request)` to pass control to the next function in the pipeline.

#### Defining Middleware

```typescript
// A simple authentication middleware
async function authMiddleware(request, next) {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // If not authenticated, redirect to login and stop the pipeline
    return redirect('/login');
  }

  // If authenticated, add user data to the request and continue
  const user = await api.get('/me');
  request.user = user; // Augment the request object

  return next(request); // Pass control to the next middleware or route handler
}
```

#### Applying Middleware

You can apply middleware globally, to a group, or to individual routes.

```typescript
const router = initRouter();

// 1. Global Middleware (runs on every request)
router.use(authMiddleware);

// 2. Group Middleware
router.group((web) => {
  web.applyMiddleware('auth'); // Apply middleware to the whole group

  web.get('/dashboard', (request) => {
    // The `request.user` property is now available here
    return view('dashboard').with({ user: request.user });
  });
});

// 3. Route-Specific Middleware
// (Requires naming your middleware first)
router.middleware('isAdmin', adminCheckMiddleware);

router.get('/admin/panel', (req) => {
  // ...
}).middleware('auth', 'isAdmin'); // Apply multiple middleware
```

### 3. Hybrid Routing: Combining Server & Client

The middleware system enables a powerful hybrid routing pattern. You can use the Inertia handler as your primary middleware, and if it fails (e.g., the server is offline), you can fall back to a set of client-side routes.

This is perfect for creating offline-capable pages or static content within a server-driven application.

**Setup in `app.ts`:**

```typescript
import { createFictifApp, initRouter, createInertiaHandler, view } from 'fictif';

// 1. Create the Inertia handler. This will be our first attempt to resolve a page.
const inertiaMiddleware = createInertiaHandler();

// 2. Initialize the router, passing the Inertia handler as middleware.
const router = initRouter(inertiaMiddleware);

// 3. Define client-side routes. These will only be reached if the
//    inertiaMiddleware calls `next()`, which it does on a network failure.

router.get('/about', () => {
  // This page can be viewed even if the server is offline.
  return view('static/about');
});

router.get('/contact', () => {
  return view('static/contact');
});

// 4. Create the Fictif app. It will automatically use the router we've configured.
createFictifApp();
```

In this setup:
*   A visit to `/dashboard` hits the `inertiaMiddleware`, which fetches the page from your backend.
*   A visit to `/about`, if the user is offline, will fail in the `inertiaMiddleware`. Control is passed to the next handler, which is your client-side `router.get('/about', ...)` definition, successfully rendering the page from the client bundle.

This pattern gives you the best of both worlds: the power of a server-driven app with the resilience of a client-side one.
<!-- END: docs/deep-dive/advanced-routing.md -->

<!-- START: docs/deep-dive/the-fictif-plugin.md -->
# the fictif plugin

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
<!-- END: docs/deep-dive/the-fictif-plugin.md -->

<!-- START: docs/deep-dive/the-inertia-protocol.md -->
# the inertia protocol

# Deep Dive: The Inertia Protocol

Fictif's default, server-driven routing mode is built on a simple yet powerful design pattern known as the **Inertia Protocol**. Understanding this protocol is essential for backend developers who want to integrate Fictif with their framework of choice.

The good news is that Fictif is **100% compatible** with the official Inertia.js protocol. This means you can use any existing server-side Inertia adapter (e.g., `inertia-laravel`, `inertia-rails`) with Fictif's frontend without any changes.

### The Core Concept

Instead of a traditional separation where the frontend consumes a REST/GraphQL API, the Inertia protocol allows your backend to remain a standard, controller-driven monolith.

When Fictif makes a "visit" to a URL, it's just a standard HTTP request with a special header. Your backend's job is to detect this header and respond not with HTML, but with a specific JSON structure called a **Page Object**.

### The Request: Fictif's Headers

When Fictif makes a visit (e.g., `router.visit('/users')`), it sends the following key headers:

*   `X-Inertia: true`: This is the most important header. It signals to your backend that the request is coming from Fictif and a JSON response is expected.
*   `X-Inertia-Version: {version}`: Sends the current version of your compiled assets. This is used to detect when a new version of your frontend has been deployed.
*   `X-Inertia-Partial-Data: user,teams`: For partial reloads (`only` option), this comma-separated header tells the server which specific props are being requested.
*   `X-Requested-With: XMLHttpRequest`: A standard header indicating an AJAX request.

### The Response: The Page Object

Your backend controller's primary responsibility is to return a JSON response with the following structure.

**Example Page Object:**
```json
{
  "component": "Users/Index",
  "props": {
    "users": [
      { "id": 1, "name": "John Doe" },
      { "id": 2, "name": "Jane Smith" }
    ],
    "canCreateUser": true
  },
  "url": "/users",
  "version": "a8c7b6d5f4"
}
```

*   `component` (`string`, **required**): The "logical name" of the client-side **Screen** component to render. This name maps directly to your file system (e.g., `Users/Index` corresponds to `resources/screens/Users/Index.screen.vue`).
*   `props` (`object`, **required**): An object of data to be passed as props to the screen component. This is where you pass your database query results, user permissions, etc. Props that are marked as "lazy" by your backend adapter will only be included on partial reloads.
*   `url` (`string`, **required**): The final URL of the page. This is used to update the browser's address bar. It can differ from the requested URL in the case of a server-side redirect.
*   `version` (`string`, **required**): The current version hash of your application's assets. Fictif compares this with its own version to detect stale assets.

### Special Server Responses

Your server can control client-side behavior by returning specific HTTP status codes.

| Status Code | Header                 | Action by Fictif                                                                                                   |
| ----------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `200 OK`    | -                      | Renders the component from the Page Object in the response body.                                                   |
| `302/301`   | `Location: {url}`      | Performs a client-side `GET` visit to the new URL. The response body is ignored.                                   |
| `409 Conflict` | `X-Inertia-Location: {url}` | A version mismatch was detected. Fictif performs a hard, full-page reload to the provided URL.                    |
| `422 Unprocessable` | -               | Assumes the body contains validation errors. The `useForm` composable will automatically catch and display them. |
| `500 Server Error` | -                | Triggers Fictif's `error` event. Can be used to show a global error modal or message.                             |

By adhering to this simple request/response protocol, any backend framework can seamlessly power a Fictif frontend, creating a tightly-integrated, modern web application.
<!-- END: docs/deep-dive/the-inertia-protocol.md -->

<!-- START: docs/deep-dive/the-screen-resolver.md -->
# the screen resolver

# Deep Dive: The Screen Resolver

The Screen Resolver is the internal mechanism that Fictif uses to dynamically load your page components. It bridges the gap between the simple string names you use in your code (e.g., `'users.profile'`) and the actual Vue component files on your disk.

While you don't typically interact with the resolver directly—the router handles it for you—understanding how it works can be useful for advanced scenarios.

### How it Works

The resolver is powered by the **Screen Manifest**, a special data structure generated at build time by the [Fictif Vite Plugin](./the-fictif-plugin.md). This manifest is exposed to your application as a virtual module: `virtual:fictif-screens-data`.

The resolver consumes this manifest to provide three key functions.

### The `useScreens` Composable

You can access the resolver's capabilities through the `useScreens` composable.

```javascript
import { useScreens } from 'fictif';

const screens = useScreens();
```

The `screens` object provides the following methods:

#### `resolve(name)`

This is the primary method. It takes a logical screen name as a string and asynchronously returns the corresponding Vue component.

It lazy-loads the component, meaning the JavaScript for that screen is only downloaded from the server when `resolve` is called for the first time.

```vue
<script setup>
import { shallowRef } from 'vue';
import { useScreens } from 'fictif';

const screens = useScreens();
const dynamicModalComponent = shallowRef(null);

async function openUserEditModal() {
  // Asynchronously load the 'modals.user-edit' component
  dynamicModalComponent.value = await screens.resolve('modals.user-edit');
}
</script>

<template>
  <button @click="openUserEditModal">Edit User</button>

  <Modal v-if="dynamicModalComponent">
    <component :is="dynamicModalComponent" />
  </Modal>
</template>
```

#### `has(name)`

This method synchronously checks if a screen with a given name exists in the manifest, without actually loading the component. This is useful for preventing errors before attempting to resolve a component that might not exist.

```javascript
import { useScreens } from 'fictif';
const screens = useScreens();

function getComponentForUser(user) {
  const componentName = user.isAdmin ? 'admin.dashboard' : 'user.dashboard';

  if (screens.has(componentName)) {
    return screens.resolve(componentName);
  } else {
    // Fallback if a component doesn't exist
    return screens.resolve('fallback.dashboard');
  }
}
```

#### `list()`

This method synchronously returns a string array of all registered logical screen names. This can be helpful for debugging, building developer tools, or creating dynamic navigation menus based on all available pages.

```javascript
import { useScreens } from 'fictif';
const screens = useScreens();

const allAvailablePages = screens.list();
// -> ['home', 'about', 'contact', 'users.index', 'users.profile', ...]

console.log('Registered screens:', allAvailablePages);
<!-- END: docs/deep-dive/the-screen-resolver.md -->

<!-- START: docs/getting-started/installation-and-setup.md -->
# installation and setup

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
<!-- END: docs/getting-started/installation-and-setup.md -->

<!-- START: docs/getting-started/what-is-fictif.md -->
# what is fictif

# What is Fictif?

Fictif is a modern frontend framework that enables you to build single-page applications (SPAs) with Vue 3, but with a twist: **your backend framework drives the entire experience.**

This approach, pioneered by [Inertia.js](https://inertiajs.com), allows you to build a fully reactive, app-like interface without the complexity of creating and maintaining a separate API for your frontend. You write standard controllers and routes on your server, and Fictif handles the rest.

### How it Works: The Fictif Flow

1.  **Initial Visit:** The first request to your app is a standard, full-page load handled by your backend. The server returns a complete HTML document, including your CSS and JavaScript assets.
2.  **Fictif Initializes:** The Fictif JavaScript boots up and "hijacks" all subsequent navigation.
3.  **Subsequent Visits:** When a user clicks a link (e.g., `<a href="/users">`), Fictif intercepts the click. Instead of a full page reload, it makes an AJAX request to the same URL with a special `X-Inertia: true` header.
4.  **Server Response:** Your backend detects this header and, instead of returning a full HTML document, it returns a lightweight JSON response called a **Page Object**. This object contains the name of the Vue component to render (the "Screen") and the data (props) for that page.
5.  **Page Update:** Fictif receives the Page Object, dynamically loads the specified Vue component, and swaps it into the page without a reload. The result is a lightning-fast, seamless user experience.

### Why Choose Fictif?

*   **For the Backend Developer:** You get to keep working in the environment you love. You can use your framework's routing, controllers, authentication, and data models just as you always have. You don't need to learn GraphQL or build complex REST API endpoints for your UI.
*   **For the Frontend Developer:** You get to build your entire interface with the power and reactivity of Vue 3. You work with components, props, and state, creating a rich user experience that would be impossible with traditional server-rendered templates.
*   **For the Project:** You maintain a single, cohesive codebase. This simplifies development, reduces complexity, and makes your team more productive. Fictif provides the "batteries-included" toolkit—form handling, meta tag management, loading indicators—so you can focus on building features, not gluing libraries together.
<!-- END: docs/getting-started/what-is-fictif.md -->

<!-- START: docs/getting-started/your-first-page.md -->
# your first page

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
<!-- END: docs/getting-started/your-first-page.md -->

<!-- START: docs/ui-components/element-animations.md -->
# element animations

# Element Animations

Fictif includes a small collection of utility functions for creating polished micro-interactions. These tools are simple, dependency-free, and accessibility-aware.

## `shakeElement()`

The `shakeElement` function provides immediate, non-disruptive visual feedback by applying a "shake" animation to a DOM element. It's an excellent way to indicate an error—such as a failed login attempt or an invalid form submission—without relying on a blocking alert.

### Features

*   **Simple API:** Call the function with the target HTML element.
*   **Configurable:** Easily adjust the `duration` and `intensity` of the shake.
*   **Accessibility-First:** Automatically respects the user's `prefers-reduced-motion` setting. If reduced motion is enabled, the function does nothing.

### Usage

The most common way to use `shakeElement` is within a Vue component. Get a reference to an element using a `ref`, and then call the function when an error occurs.

Here's an example of a login form that shakes when the credentials are wrong.

```vue
<script setup>
import { ref } from 'vue';
import { shakeElement, useForm } from 'fictif';

// 1. Create a ref for the element you want to shake
const formElement = ref(null);

const form = useForm({
  email: '',
  password: '',
});

function submit() {
  form.post('/login', {
    // 3. In the onError callback, trigger the shake animation
    onError: () => {
      shakeElement(formElement.value);
    }
  });
}
</script>

<template>
  <!-- 2. Assign the ref to the target element -->
  <form ref="formElement" @submit.prevent="submit">
    <h2>Login</h2>
    <input type="email" v-model="form.email" placeholder="Email" />
    <input type="password" v-model="form.password" placeholder="Password" />
    <button type="submit" :disabled="form.processing">Sign In</button>
  </form>
</template>
```

### API Reference

`shakeElement(element, duration?, intensity?)`

#### Parameters

| Parameter   | Type            | Default | Description                                                                    |
| ----------- | --------------- | ------- | ------------------------------------------------------------------------------ |
| `element`   | `HTMLElement`   | `main`  | The target DOM element to shake. If not provided, it defaults to `<main>`.     |
| `duration`  | `number`        | `300`   | The total duration of the shake animation, in milliseconds.                    |
| `intensity` | `number`        | `10`    | The maximum distance, in pixels, that the element will move from its origin.   |

#### Example with Custom Parameters

You can create a more aggressive shake by increasing the intensity and decreasing the duration.

```javascript
import { ref } from 'vue';
import { shakeElement } from 'fictif';

const buttonRef = ref(null);

// ...
shakeElement(
  buttonRef.value,
  200, // Faster duration (200ms)
  15   // Higher intensity (15px)
);
<!-- END: docs/ui-components/element-animations.md -->

<!-- START: docs/ui-components/loading-indicators-curtain.md -->
# loading indicators curtain

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
<!-- END: docs/ui-components/loading-indicators-curtain.md -->

<!-- START: docs/ui-components/multi-step-wizards.md -->
# multi step wizards

# Multi-Step Wizards

Creating multi-step forms or onboarding flows can be complex to manage. Fictif provides a `<MultiStep>` component that handles the state, transitions, and animations for you, allowing you to focus on the content of each step.

### Features

*   **State Management:** Automatically tracks the current step.
*   **Smooth Transitions:** Provides animated slide transitions between steps.
*   **Dynamic Height:** The component container animates its height to perfectly match the content of each step.
*   **Slot-Based API:** Define each step using named slots in Vue.
*   **Programmatic Control:** A simple API to navigate between steps (`next()`, `back()`, `goto()`).

### Basic Usage

To use the `<MultiStep>` component, you provide your steps as named `<template>` slots. You can then use the `v-slot` directive to access the component's API and create navigation controls.

```vue
<!-- Example: A user registration flow -->
<script setup>
import { MultiStep } from 'fictif';
</script>

<template>
  <MultiStep v-slot="{ next, back, canGoBack, canGoNext, currentStep }">
    <!-- Step 1: Welcome -->
    <template #welcome>
      <h1>Welcome!</h1>
      <p>Let's get your account set up.</p>
      <button @click="next">Start</button>
    </template>

    <!-- Step 2: Personal Info -->
    <template #personal-info>
      <h2>Personal Information</h2>
      <input type="text" placeholder="Your Name" />
      <input type="email" placeholder="Your Email" />
    </template>

    <!-- Step 3: Password -->
    <template #password>
      <h2>Create a Password</h2>
      <input type="password" placeholder="Password" />
      <input type="password" placeholder="Confirm Password" />
    </template>

    <!-- Step 4: Finish -->
    <template #finish>
      <h2>All Done!</h2>
      <p>Your account is ready.</p>
      <button>Go to Dashboard</button>
    </template>

    <!-- Navigation Controls -->
    <div class="navigation-controls">
      <button @click="back" :disabled="!canGoBack">Back</button>
      <button @click="next" :disabled="!canGoNext">Next</button>
    </div>
  </MultiStep>
</template>
```

### Programmatic Control with a `ref`

For more complex scenarios, you can get a reference to the component instance to call its navigation methods from your `<script>` block.

```vue
<script setup>
import { ref } from 'vue';
import { MultiStep } from 'fictif';

// 1. Create a ref for the component
const multiStepRef = ref(null);

function jumpToPasswordStep() {
  // 2. Call methods on the component instance
  multiStepRef.value.goto('password');
}
</script>

<template>
  <!-- 3. Assign the ref to the component -->
  <MultiStep ref="multiStepRef">
    <template #welcome>
      <!-- ... -->
    </template>
    <template #password>
      <!-- ... -->
    </template>
  </MultiStep>

  <button @click="jumpToPasswordStep">Jump to Password</button>
</template>
```

### API Reference

#### Props

The `<MultiStep>` component does not accept any props.

#### Slots

| Slot Name | Usage                                                                       |
| --------- | --------------------------------------------------------------------------- |
| `default` | Provides the navigation API to its children (`next`, `back`, `goto`, etc.). |
| Named     | Each named slot (e.g., `<template #step1>`) defines a step in the flow.     |

#### Exposed API (`ref` methods & properties)

| Method/Property     | Type                 | Description                                                               |
| ------------------- | -------------------- | ------------------------------------------------------------------------- |
| `next()`            | `Function`           | Navigates to the next step.                                               |
| `back()`            | `Function`           | Navigates to the previous step.                                           |
| `goto(name)`        | `Function`           | Navigates directly to the step with the given slot name.                  |
| `currentStep`       | `ComputedRef<string>`| The name of the currently active step.                                    |
| `currentStepIndex`  | `Ref<number>`        | The zero-based index of the currently active step.                        |
| `steps`             | `ComputedRef<string[]>`| An array of all available step names.                                     |
| `canGoNext`         | `ComputedRef<boolean>`| `true` if not on the last step.                                           |
| `canGoBack`         | `ComputedRef<boolean>`| `true` if not on the first step.                                          |

#### Events

| Event Name      | Payload                                           | Description                                                                                                                                              |
| --------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `before-leave`  | `{ from, to, direction, next, cancel }`           | Fired before a transition begins. You can perform validation here. Call `cancel()` to prevent the transition, or call `next()` to proceed asynchronously. |
| `after-leave`   | `{ current }`                                     | Fired after a transition has completed and the new step is visible.                                                                                      |
<!-- END: docs/ui-components/multi-step-wizards.md -->

