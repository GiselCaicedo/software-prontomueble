import type { LocalePrefixMode } from 'node_modules/next-intl/dist/types/src/routing/types';

const localePrefix: LocalePrefixMode = 'as-needed';

// FIXME: Update this configuration file based on your project information
export const AppConfig = {
  name: 'Prontomueble',
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix,
};