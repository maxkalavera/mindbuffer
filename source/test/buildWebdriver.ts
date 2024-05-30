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
          '--headless',
          //'--no-sandbox',
          //'--disable-dev-shm-usage',
          //'--disable-extensions',
          //'--disable-setuid-sandbox',
          //'--remote-debugging-pipe', // On linux sometimes produces a Timeout due to a bug
        ]
      
      }
    })
    .forBrowser('chrome')
    .build()

  return driver;
}
