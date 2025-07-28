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