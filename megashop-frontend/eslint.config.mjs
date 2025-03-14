import next from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import nextConfig from "eslint-config-next"; // ✅ Import Next.js ESLint config properly

export default [
  nextConfig, // ✅ Ensure Next.js ESLint config is included properly
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "@typescript-eslint": tseslint },
    languageOptions: {
      parser: tsparser,
      sourceType: "module",
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn", // Adjust as needed
    },
  },
];
