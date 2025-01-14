import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-require-imports": "off"
    }
  }, {
    ignores: [
      "**/service/array.service.ts",
      "**/events/message.listener.ts",
      "**/events/interaction-create.listener.ts",
      "**/discord/deploy.commands.ts",
      "**/types/telegram/*.{type,types}.ts"
    ]
  }
];