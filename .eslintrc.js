module.exports = {
  root: true,
  env: {
    node: true,
    // Declara defineProps/defineEmits/defineExpose/withDefaults como globales.
    // Sin esto, ESLint marca `defineProps is not defined` y hay que importarlo
    // desde 'vue', que es el patrón deprecado que usan los componentes viejos.
    // Lo provee eslint-plugin-vue 8+.
    'vue/setup-compiler-macros': true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
