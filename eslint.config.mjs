import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import tseslint from '@typescript-eslint/eslint-plugin';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: {
            js,
            '@typescript-eslint': tseslint,
        },
        extends: ['js/recommended'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },
        rules: {
            // ✅ Catch forgetting "await"
            '@typescript-eslint/no-floating-promises': 'error',

            // ✅ Catch async functions without await
            'require-await': 'error',
        },
    },
]);
