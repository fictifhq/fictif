# How to Contribute

Thank you for your interest in contributing to Fictif! We're thrilled to have you. Community contributions are the lifeblood of an open-source project, and every contribution, no matter how small, is deeply appreciated.

This guide will walk you through the process of contributing to the project.

### Types of Contributions

There are many ways to contribute to Fictif:

*   **Reporting Bugs:** Find a bug? Let us know by [opening an issue](https://github.com/fictifhq/fictif/issues). A detailed report helps us fix it faster.
*   **Suggesting Enhancements:** Have an idea for a new feature or an improvement to an existing one? Start a conversation on [GitHub Discussions](https://github.com/fictifhq/fictif/discussions).
*   **Improving Documentation:** Find a typo, a confusing sentence, or a missing guide? Documentation improvements are one of the easiest and most valuable ways to contribute.
*   **Submitting Code:** Ready to write some code? You can work on an existing bug or add a new feature.

### Your First Code Contribution

Ready to submit a pull request? Here’s how to get your development environment set up.

#### 1. Fork & Clone the Repository

First, fork the main `fictifhq/fictif` repository on GitHub. Then, clone your fork to your local machine.

```bash
git clone https://github.com/YOUR_USERNAME/fictif.git
cd fictif
```

#### 2. Install Dependencies

Fictif uses `pnpm` for workspace management. Install the dependencies for all packages.

```bash
pnpm install
```

#### 3. Run the Development Environment

The repository is a monorepo containing the core Fictif package and potentially a documentation or demo application. You can run the development server to test your changes.

```bash
# This will likely be a command to run the playground or test app
pnpm run dev
```

#### 4. Create a New Branch

Create a new branch for your changes. Use a descriptive name, such as `fix/form-reset-bug` or `feat/add-dark-mode-curtain`.

```bash
git checkout -b your-branch-name
```

#### 5. Make Your Changes

Make your desired code changes. Be sure to follow the existing code style and conventions. If you are adding a new feature, consider adding tests to cover it.

#### 6. Submit a Pull Request

Once you are happy with your changes, commit them and push your branch to your forked repository on GitHub.

```bash
git add .
git commit -m "feat: Add dark mode option to Curtain component"
git push -u origin your-branch-name
```

Finally, go to the main Fictif repository on GitHub and open a pull request. In the PR description, please describe the changes you've made and link to any relevant issues or discussions. A core team member will review your contribution as soon as possible.

Thank you again for helping make Fictif better!

