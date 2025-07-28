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