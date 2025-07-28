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