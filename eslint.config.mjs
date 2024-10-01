import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        console: 'readonly',
        localStorage: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLButtonElement: 'readonly',
        // Add any other global variables you're using
      },
    },
    rules: {
     '@typescript-eslint/no-unused-vars': 1,
     'no-unused-vars': 1,
     'no-undef': 2,
    }
  },
);
