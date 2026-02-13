import js from '@eslint/js'
import ts from 'typescript-eslint'
import vue from 'eslint-plugin-vue'

export default ts.config(
  { ignores: ['dist/', 'public/mockServiceWorker.js'] },

  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs['flat/recommended'],

  {
    languageOptions: {
      globals: {
        // Browser globals
        HTMLElement: 'readonly',
        IntersectionObserver: 'readonly',
        KeyboardEvent: 'readonly',
        Event: 'readonly',
        console: 'readonly',
        document: 'readonly',
        window: 'readonly',
        localStorage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
  },

  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
  },

  {
    rules: {
      // Handled by TypeScript compiler
      '@typescript-eslint/no-unused-vars': 'off',

      // False positives in <script setup> - reactive bindings are used in template
      'no-useless-assignment': 'off',

      // Allow non-null assertions - TS strict mode covers safety
      '@typescript-eslint/no-non-null-assertion': 'off',

      // Vue rules
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/no-mutating-props': 'error',

      // Stylistic - match existing codebase conventions
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': ['warn', {
        html: { void: 'always', normal: 'never', component: 'always' },
      }],
      'vue/attribute-hyphenation': 'off',
      'vue/v-on-event-hyphenation': 'off',
    },
  },
)
