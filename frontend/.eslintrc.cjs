/* eslint-disable */
module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "react", "react-hooks", "import"],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:import/recommended",
      "plugin:import/typescript",
      "prettier",
    ],
    settings: { react: { version: "detect" } },
    env: { browser: true, es2022: true, node: true },
    parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    rules: {
      "react/react-in-jsx-scope": "off",
      "import/order": ["error", { "newlines-between": "always", alphabetize: { order: "asc" } }],
      "@typescript-eslint/no-explicit-any": "warn"
    },
    ignorePatterns: ["dist/", "coverage/"]
  };
  