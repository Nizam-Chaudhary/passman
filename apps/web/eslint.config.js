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
  ...pluginQuery.configs["flat/recommended"]
);
