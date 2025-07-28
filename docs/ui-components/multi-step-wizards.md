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