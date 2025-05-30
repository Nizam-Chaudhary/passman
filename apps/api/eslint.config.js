import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import drizzle from "eslint-plugin-drizzle";

/** @type {import('eslint').Linter.Config[]} */
export default [
    { ignores: ["dist", "node_modules"] },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: { drizzle },
        rules: {
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/no-explicit-any": "off",
        },
        languageOptions: { globals: globals.node },
    },
];
