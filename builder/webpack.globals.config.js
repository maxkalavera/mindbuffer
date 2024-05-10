const path = require("path");

const MODE = ['development', 'production']
  .find(item => item === process.env.MINDBUFFER_ENVIRONMENT) || 'production'

module.exports = {
  process: { env: { NODE_ENV: JSON.stringify(MODE), } },
  MODE: JSON.stringify(MODE),
  HTML_INDEX_ENTRY: JSON.stringify(path.resolve(__dirname, './.webpack/renderer/index.html')),
  ENVIRONMENT: JSON.stringify(
    ['development', 'production', 'testing']
      .find(item => item === process.env.MINDBUFFER_ENVIRONMENT) || 'production'
  ),
  DEBUG: JSON.stringify(
    (process.env.MINDBUFFER_DEBUG || '').toLowerCase() === 'true' // default false
  ),
  PAGINATION_OFFSET: JSON.stringify(
    parseInt(process.env.MINDBUFFER_PAGINATION_OFFSET || '') || 20
  ),
  ASSOCIATED_PAGES_PAGINATION_OFFSET: JSON.stringify(
    parseInt(process.env.MINDBUFFER_ASSOCIATED_PAGES_PAGINATION_OFFSET || '') || 50
  ),
}