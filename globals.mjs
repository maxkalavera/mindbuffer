
export default {
  ENVIRONMENT: ['development', 'production', 'testing']
    .find(item => item === process.env.MINDBUFFER_ENVIRONMENT) || 'production',
  DEBUG:
    process.env.MINDBUFFER_ENVIRONMENT === 'development' ||
    (process.env.MINDBUFFER_DEBUG || '').toLowerCase() === 'true', // default false
  RESET_SETTINGS_STORE:
    (process.env.MINDBUFFER_RESET_SETTINGS_STORE || '').toLowerCase() === 'true', // default false
  PAGINATION_OFFSET: 
    parseInt(process.env.MINDBUFFER_PAGINATION_OFFSET || '') || 20,
  ASSOCIATED_PAGES_PAGINATION_OFFSET: 
    parseInt(process.env.MINDBUFFER_ASSOCIATED_PAGES_PAGINATION_OFFSET || '') || 50,
}
