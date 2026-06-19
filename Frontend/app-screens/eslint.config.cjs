module.exports = {
  root: true,
  plugins: {
    '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
  },
  languageOptions: {
    parser: require.resolve('@typescript-eslint/parser'),
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
    },
  },
  rules: {},
};
