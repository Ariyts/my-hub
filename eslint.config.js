import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  {
    // Не линтим сборку, зависимости и сгенерированные данные
    ignores: ["dist/**", "node_modules/**", "public/**", "data/**", "src/data*.json"],
  },

  // Исходники приложения: браузер + React
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      // Vite HMR: файл-модуль должен экспортировать только компоненты
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // Неиспользуемое с префиксом _ — осознанно проигнорировано
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // any в существующем коде — сигнал к рефакторингу, но не блокер
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // Конфиги и скрипты сборки: Node-окружение
  {
    files: ["*.config.{js,ts}", "scripts/**/*.{js,cjs,mjs}"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
      sourceType: "module",
    },
  },
  {
    files: ["scripts/**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
    },
    rules: {
      // .cjs — это CommonJS, require() здесь уместен
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // Отключает правила, конфликтующие с Prettier. Всегда последним.
  prettier,
);
