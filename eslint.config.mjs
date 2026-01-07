import { defineConfig, globalIgnores } from 'eslint/config';
import adonisV5 from 'eslint-config-zakodium/adonis-v5';
import ts from 'eslint-config-zakodium/ts';
import unicorn from 'eslint-config-zakodium/unicorn';

export default defineConfig(
  globalIgnores(['coverage', 'lib']),
  ts,
  unicorn,
  adonisV5,
  {
    files: ['test-utils/fixtures/schema/test1/**'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
);
