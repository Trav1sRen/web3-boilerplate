module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'plugin:vitest/all',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'prettier',
    'testing-library',
    'vitest',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'prettier/prettier': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'react/no-unknown-property': ['error', { ignore: ['css'] }],

    // For Vitest and RTL
    'vitest/no-identical-title': 'error',
    'vitest/consistent-test-it': ['error', { fn: 'it' }],
    'testing-library/prefer-screen-queries': 'off',
    'testing-library/no-node-access': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['**/*.test.{ts,tsx}'],
      env: {
        'vitest/globals': true,
      },
      rules: {
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
      },
    },
  ],
};
