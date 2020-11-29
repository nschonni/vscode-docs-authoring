module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2018,
  },
  overrides: [
    {
      files: ["**/*.js"],
      parserOptions: {
        ecmaVersion: 2018,
      },
    },
    {
      files: ["**/*.ts"],
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:import/typescript",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
      },
      plugins: ["@typescript-eslint", "import"],
      settings: {
        "import/resolver": {
          node: {
            extensions: [".js", ".ts"],
          },
        },
      },
    },
    {
      files: ["**/test/**/*.ts"],
      env: {
        mocha: true,
      },
    },
  ],
};
