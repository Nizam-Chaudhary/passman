#PNPM monorepo

```json
{
    "lint-staged": {
        "**/*.{js,ts,tsx}": ["eslint --fix"],
        "**/*": "prettier --write --ignore-unknown"
    }
}
```
