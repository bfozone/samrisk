import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    typescript: true,
    ignores: ['dist/', 'public/mockServiceWorker.js'],
  },
  {
    rules: {
      'ts/no-unused-vars': 'off',
      'unused-imports/no-unused-vars': 'off',
      'ts/no-non-null-assertion': 'off',
      'no-useless-assignment': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/no-mutating-props': 'error',
      'vue/html-self-closing': ['warn', {
        html: { void: 'always', normal: 'never', component: 'always' },
      }],
      'vue/attribute-hyphenation': 'off',
      'vue/v-on-event-hyphenation': 'off',
    },
  },
)
