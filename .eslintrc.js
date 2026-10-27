module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      rules: { '@typescript-eslint/no-explicit-any': 'error' },
    },
  ],
};
