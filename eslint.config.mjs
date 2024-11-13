import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        console: 'readonly',
        fetch:   'readonly',
        then:    'readonly',
        window:  'readonly',
        localStorage: 'readonly',
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLButtonElement: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame:  'readonly',
      },
    },
    rules: {
     '@typescript-eslint/no-unused-vars': 1,
     'no-unused-vars': 1,
     'no-undef': 2,
    }
  },
);
