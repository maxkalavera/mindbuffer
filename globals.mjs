
const prefix = 'AMBERPAD_';
const envs = Object.fromEntries( // Filter envs by prefix
  Object.entries(process.env)
    .filter(([key, value]) => key.startsWith(prefix))
    .map(([key, value]) => [key.replace(prefix, ''), value])
);

export default {
  ENV_PREFIX: prefix,
  ENVIRONMENT: ['development', 'production', 'testing']
    .find(item => item === envs.ENVIRONMENT) || 'production',
  DEBUG:
  envs.ENVIRONMENT === 'development' ||
    (envs.DEBUG || '').toLowerCase() === 'true', // default false
  RESET_SETTINGS_STORE:
    (envs.RESET_SETTINGS_STORE || '').toLowerCase() === 'true', // default false
  PAGINATION_OFFSET: 
    parseInt(envs.PAGINATION_OFFSET || '') || 20,
  ASSOCIATED_PAGES_PAGINATION_OFFSET: 
    parseInt(envs.ASSOCIATED_PAGES_PAGINATION_OFFSET || '') || 50,
}
