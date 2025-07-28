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