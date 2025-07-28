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