import antfu from "@antfu/eslint-config";
import pluginQuery from "@tanstack/eslint-plugin-query";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default antfu(
  {
    react: true,
    formatters: false,
    stylistic: false,
    ignores: ["**/routeTree.gen.ts"],
    plugins: [
      {
        "eslint-plugin-prettier": eslintPluginPrettier,
      },
    ],
  },
  ...pluginQuery.configs["flat/recommended"],
  {
    rules: {
      "ts/no-redeclare": "off",
      "ts/consistent-type-definitions": ["error", "interface"],
      "no-console": ["warn"],
      "antfu/no-top-level-await": ["off"],
      "node/prefer-global/process": ["off"],
      "node/no-process-env": ["error"],
      "perfectionist/sort-imports": [
        "error",
        {
          tsconfigRootDir: ".",
        },
      ],
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
          ignore: ["README.md", "src/routeTree.gen.ts", "src/routes"],
        },
      ],
    },
  },
);
