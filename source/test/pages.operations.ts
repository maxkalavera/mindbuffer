import webdriver, { By, Key, until } from 'selenium-webdriver';

export const createPage = async (
  driver: webdriver.ThenableWebDriver,
  notepadName: string,
  name: string,
) => {
  const notepadOptionsButton = await driver.wait(until.elementLocated(By.xpath(
    `//*[contains(text(), '${notepadName}')]` + // Notepad text element
    `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]` + // Notepad element
    `//descendant::*[contains(@class, 'class:notepad-options-button:GrWzrbooC9')]` // Options button
  )), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(notepadOptionsButton), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(notepadOptionsButton), WAIT_UNTIL_TIMEOUT)
  await notepadOptionsButton.click()
  const createPageButton = await driver.wait(until.elementLocated(By.xpath(
    `//*[contains(text(), '${notepadName}')]` + // Notepad text element
    `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]` + // Notepad element
    `//descendant::*[contains(@class, 'class:notepad-options-create-page-button:LLAk9dX9bP')]` // Create Page button
  )), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(createPageButton), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(createPageButton), WAIT_UNTIL_TIMEOUT)
  await createPageButton.click()
  const nameInput = await driver.wait(until.elementLocated(By.xpath(
    `//div[contains(@class, 'class:page-modal-name-input-wrapper:o0Tmq3A18Z')]` +
    `//descendant::input`
  )), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(nameInput), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(nameInput), WAIT_UNTIL_TIMEOUT)
  await nameInput.clear()
  await nameInput.sendKeys(name)
  const confirmButton = await driver.findElement(By.className('class:modal-confirm-button:fHIbu0jVfe'))
  await confirmButton.click()
}

export const updatePage = async (
  driver: webdriver.ThenableWebDriver,
  name: string,
  newName: string,
) => {
  const pageOptionsButton = await driver.wait(until.elementLocated(By.xpath(
    `//*[contains(text(), '${name}')]` +
    `//ancestor::*[contains(@class, 'class:page:8o3bzP8yoT')]` +
    `//descendant::*[contains(@class, 'class:page-options-button:WvlSIUCzRC')]`
  )), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(pageOptionsButton), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(pageOptionsButton), WAIT_UNTIL_TIMEOUT)
  await pageOptionsButton.click()
  const updatePageButton = await driver.wait(until.elementLocated(By.xpath(
    `//*[contains(text(), '${name}')]` +
    `//ancestor::*[contains(@class, 'class:page:8o3bzP8yoT')]` +
    `//descendant::*[contains(@class, 'class:page-options-edit-button:1bWdLl8T87')]`
  )), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(updatePageButton), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(updatePageButton), WAIT_UNTIL_TIMEOUT)
  await updatePageButton.click()
  const nameInput = await driver.wait(until.elementLocated(By.xpath(
    `//div[contains(@class, \'class:page-modal-name-input-wrapper:o0Tmq3A18Z\')]` +
    `//descendant::input`
  )), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(nameInput), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(nameInput), WAIT_UNTIL_TIMEOUT)
  await nameInput.clear()
  await nameInput.sendKeys(newName)
  const confirmButton = await driver.wait(until.elementLocated(By.className('class:modal-confirm-button:fHIbu0jVfe')), WAIT_UNTIL_TIMEOUT)
  await confirmButton.click()
}

export const deletePage = async (
  driver: webdriver.ThenableWebDriver,
  name: string,
) => {
  const pageOptionsButton = await driver.wait(until.elementLocated(By.xpath(
    `//*[contains(text(), '${name}')]` +
    `//ancestor::*[contains(@class, 'class:page:8o3bzP8yoT')]` +
    `//descendant::*[contains(@class, 'class:page-options-button:WvlSIUCzRC')]`
  )), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(pageOptionsButton), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(pageOptionsButton), WAIT_UNTIL_TIMEOUT)
  await pageOptionsButton.click()
  const updatePageButton = await driver.wait(until.elementLocated(By.xpath(
    `//*[contains(text(), '${name}')]` +
    `//ancestor::*[contains(@class, 'class:page:8o3bzP8yoT')]` +
    `//descendant::*[contains(@class, 'class:page-options-delete-button:excgDO3li2')]`
  )), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(updatePageButton), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(updatePageButton), WAIT_UNTIL_TIMEOUT)
  await updatePageButton.click()
  const confirmButton = driver.wait(until.elementLocated(By.className('class:modal-confirm-button:fHIbu0jVfe')), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(confirmButton), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(confirmButton), WAIT_UNTIL_TIMEOUT)
  await confirmButton.click()
}

export const countPages = async (
  driver: webdriver.ThenableWebDriver,
) => {
  return (await driver.findElements(By.xpath(
    `//*[@id='id:notepad-list-container:7MLMomsYBt']` +
    `//descendant::*[contains(@class, 'class:page:8o3bzP8yoT')]`
  ))).length
}

export const clickPage = async (
  driver: webdriver.ThenableWebDriver,
  pageName: string,
) => {
  const page = await driver.wait(until.elementLocated(By.xpath(
    `//*[contains(text(), '${pageName}')]` +
    `//ancestor-or-self::*[contains(@class, 'class:page:8o3bzP8yoT')]`
  )), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(page), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(page), WAIT_UNTIL_TIMEOUT)
  await page.click()
}
