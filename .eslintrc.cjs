module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['standard-with-typescript', 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: true,
    projectRoot: __dirname,
  },
  plugins: ['react'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    semi: ['error', 'always'],
    '@typescript-eslint/semi': 'off',
    'react/react-in-jsx-scope': 'off',
    'space-before-function-paren': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    'multiline-ternary': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
  },
};
