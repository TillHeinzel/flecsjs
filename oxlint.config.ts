import { defineConfig } from "oxlint";

export default defineConfig({
  options: {
    typeAware: true,
  },
  ignorePatterns: ["dist/**"],
  rules: {
    "typescript/switch-exhaustiveness-check": "error",
  },
});
