import { includeIgnoreFile } from '@eslint/compat';
import radham from '@radham/eslint-config';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const gitignorePath = path.resolve(dirname, '.gitignore');

export default defineConfig([
  includeIgnoreFile(gitignorePath),
  {
    files: ['**/*.js', '!eslint.config.js'],
    languageOptions: { globals: globals.browser }
  },
  {
    files: ['eslint-config.js'],
    languageOptions: { globals: globals.node }
  },
  {
    extends: [radham]
  }
]);
