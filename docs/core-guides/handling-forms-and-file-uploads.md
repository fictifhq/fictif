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