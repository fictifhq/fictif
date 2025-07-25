/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: false },
    extraFileExtensions: [".vue"],
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
  ],
  plugins: [
    "vue",
    "@typescript-eslint",
    "import",
    "prettier"
  ],
  rules: {
    // General
    "no-unused-vars": "off", // handled by TS
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

    // Vue
    "vue/no-v-html": "off",
    "vue/multi-word-component-names": "off",
    "vue/script-setup-uses-vars": "error",
    "vue/no-multiple-template-root": "off",

    // Import
    "import/order": [
      "warn",
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always"
      }
    ],

    // Prettier
    "prettier/prettier": [
      "warn",
      {
        semi: false,
        singleQuote: true,
        trailingComma: "es5",
        printWidth: 100,
        tabWidth: 2,
        arrowParens: "avoid"
      }
    ]
  },
  overrides: [
    {
      files: ["*.ts", "*.vue"],
      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
  ],
}
