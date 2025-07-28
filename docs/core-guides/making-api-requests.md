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