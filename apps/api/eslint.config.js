import antfu from "@antfu/eslint-config";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default antfu({
  formatters: true,
  stylistic: false,
  plugins: [
    {
      "eslint-plugin-prettier": eslintPluginPrettier,
    },
  ],
});
