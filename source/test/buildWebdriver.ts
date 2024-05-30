import webdriver from 'selenium-webdriver'

export default async function buildWebdriver (): Promise<webdriver.ThenableWebDriver> {
  const driver = new webdriver.Builder()
    .usingServer('http://localhost:9515')
    .withCapabilities({
      'timeouts': {
        implicit: EXTRA_SHORT_TIMEOUT, 
        pageLoad: EXTRA_LONG_TIMEOUT, 
        script: REGULAR_TIMEOUT
      },
      'goog:chromeOptions': {
        binary: global.__BINARY_PATH__,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-extensions',
          '--remote-debugging-pipe',
        ]
      
      }
    })
    .forBrowser('chrome')
    .build()

  return driver;
}