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