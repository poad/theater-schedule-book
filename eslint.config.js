// @ts-check

import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { parser, configs } from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

import solid from "eslint-plugin-solid/configs/typescript";

import { includeIgnoreFile } from '@eslint/compat';
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default defineConfig(
  includeIgnoreFile(gitignorePath),
  {
    ignores: [
      '**/*.d.ts',
      '*.{js,jsx}',
      'src/tsconfig.json',
      'src/stories',
      '**/*.css',
      'node_modules/**/*',
      'dist',
    ],
  },
  eslint.configs.recommended,
  ...configs.strict,
  ...configs.stylistic,
  {
    files: ['src/**/*.{ts,tsx}'],
    ...solid,
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    languageOptions: {
      parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@stylistic': stylistic,
    },
    settings: {
      'import/parsers': {
        espree: ['.js', '.cjs', '.mjs'],
        '@typescript-eslint/parser': ['.ts'],
      },
      'import/internal-regex': '^~/',
      'import/resolver': {
        node: {
          extensions: ['.ts', '.tsx'],
        },
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/quotes': ['error', 'single'],
      'import/no-named-as-default': 'off',
      'import/export': 'off',
    }
  },
);
