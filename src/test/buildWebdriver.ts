import webdriver from 'selenium-webdriver'

export default function buildWebdriver (): webdriver.ThenableWebDriver {
  return new webdriver.Builder()
    .usingServer('http://localhost:9515')
    .withCapabilities({
      'goog:chromeOptions': {
        binary: global.__BINARY_PATH__,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-extensions',
        ]
      }
    })
    .forBrowser('chrome')
    .build()
}