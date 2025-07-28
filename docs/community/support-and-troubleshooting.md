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