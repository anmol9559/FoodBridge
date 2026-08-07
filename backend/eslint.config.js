const js = require('@eslint/js')
const globals = require('globals')

module.exports = [
  { ignores: ['node_modules', 'generated', 'coverage'] },
  {
    files: ['src/**/*.js', 'tests/**/*.js'],
    ...js.configs.recommended,
    languageOptions: { globals: { ...globals.node } },
    rules: { 'no-unused-vars': ['error', { argsIgnorePattern: '^_' }] },
  },
]
