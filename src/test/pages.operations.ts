import webdriver, { By, Key, until } from 'selenium-webdriver';

export const createPage = async (
  driver: webdriver.ThenableWebDriver,
  notepadName: string,
  name: string,
) => {
  const notepadOptionsButton = await driver.findElement(By.xpath(
    `//*[contains(text(), '${notepadName}')]` + // Notepad text element
    `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]` + // Notepad element
    `//descendant::*[contains(@class, 'class:notepad-options-button:GrWzrbooC9')]` // Options button
  ))
  await notepadOptionsButton.click()
  const createPageButton = await driver.findElement(By.xpath(
    `//*[contains(text(), '${notepadName}')]` + // Notepad text element
    `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]` + // Notepad element
    `//descendant::*[contains(@class, 'class:notepad-options-create-page-button:LLAk9dX9bP')]` // Create Page button
  ))
  await createPageButton.click()
  const nameInput = await driver.findElement(By.xpath(
    `//div[contains(@class, 'class:page-modal-name-input-wrapper:o0Tmq3A18Z')]` + // Input wrapper element
    `//descendant::input` // HTML input element 
  ))
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
  const pageOptionsButton = await driver.findElement(By.xpath(
    `//*[contains(text(), '${name}')]` +
    `//ancestor::*[contains(@class, 'class:page:8o3bzP8yoT')]` +
    `//descendant::*[contains(@class, 'class:page-options-button:WvlSIUCzRC')]`
  ))
  await pageOptionsButton.click()
  const updatePageButton = await driver.findElement(By.xpath(
    `//*[contains(text(), '${name}')]` +
    `//ancestor::*[contains(@class, 'class:page:8o3bzP8yoT')]` +
    `//descendant::*[contains(@class, 'class:page-options-edit-button:1bWdLl8T87')]`
  ))
  await updatePageButton.click()
  const nameInput = await driver.findElement(By.xpath(
    `//div[contains(@class, \'class:page-modal-name-input-wrapper:o0Tmq3A18Z\')]` +
    `//descendant::input`
  ))
  await nameInput.clear()
  await nameInput.sendKeys(newName)
  const confirmButton = await driver.findElement(By.className('class:modal-confirm-button:fHIbu0jVfe'))
  await confirmButton.click()
}

export const deletePage = async (
  driver: webdriver.ThenableWebDriver,
  name: string,
) => {
  const pageOptionsButton = await driver.findElement(By.xpath(
    `//*[contains(text(), '${name}')]` +
    `//ancestor::*[contains(@class, 'class:page:8o3bzP8yoT')]` +
    `//descendant::*[contains(@class, 'class:page-options-button:WvlSIUCzRC')]`
  ))
  await pageOptionsButton.click()
  const updatePageButton = await driver.findElement(By.xpath(
    `//*[contains(text(), '${name}')]` +
    `//ancestor::*[contains(@class, 'class:page:8o3bzP8yoT')]` +
    `//descendant::*[contains(@class, 'class:page-options-delete-button:excgDO3li2')]`
  ))
  await updatePageButton.click()
  const confirmButton = await driver.findElement(By.className('class:modal-confirm-button:fHIbu0jVfe'))
  await confirmButton.click()
}

export const clickPage = async (
  driver: webdriver.ThenableWebDriver,
  pageName: string,
) => {
  return (await driver.findElements(By.xpath(
    `//*[contains(text(), '${pageName}')]` +
    `//ancestor::*[contains(@class, 'class:page:8o3bzP8yoT')]`
  ))).length
}

export const countPages = async (
  driver: webdriver.ThenableWebDriver,
) => {
  return (await driver.findElements(By.xpath(
    `//*[@id='id:notepad-list-container:7MLMomsYBt']` +
    `//descendant::*[contains(@class, 'class:page:8o3bzP8yoT')]`
  ))).length
}