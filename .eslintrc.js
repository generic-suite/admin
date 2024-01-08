module.exports = {
  extends: [require.resolve('@umijs/lint/dist/config/eslint')],
  globals: {
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-continue': 'off',
    'no-restricted-syntax': 'off',
  },
};
