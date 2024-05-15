import webdriver, { By, Key, until } from 'selenium-webdriver';

export const createNotepad = async (
  driver: webdriver.ThenableWebDriver,
  name: string,
) => {
  const createButton = await driver.wait(until.elementLocated(By.id('id:create-notepad-button:f9CFxx4pON')))
  await driver.wait(until.elementIsVisible(createButton))
  await driver.wait(until.elementIsEnabled(createButton))
  await createButton.click()
  const nameInput = await driver.wait(until.elementLocated(By.xpath(
    '//div[contains(@class, \'class:create-notepad-name-input:hWmi28rONe\')]' +
    '//descendant::input'
  )))
  await driver.wait(until.elementIsVisible(nameInput))
  await nameInput.sendKeys(name)
  const confirmButton = await driver.wait(until.elementLocated(By.className('class:modal-confirm-button:fHIbu0jVfe')))
  await confirmButton.click()
}

export const updateNotepad = async (
  driver: webdriver.ThenableWebDriver,
  name: string,
  newName: string,
) => {
  const optionsButton = await driver.wait(until.elementLocated(By.xpath(
    `//*[contains(text(), '${name}')]` +
    `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]` +
    `//descendant::*[contains(@class, 'class:notepad-options-button:GrWzrbooC9')]`
  )))
  await driver.wait(until.elementIsVisible(optionsButton))
  await optionsButton.click()
  const editButton = await driver.wait(until.elementLocated(By.xpath(
    `//*[contains(text(), '${name}')]` +
    `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]` +
    `//descendant::*[contains(@class, 'class:notepad-options-edit-button:OJSSF5T46S')]`
  )))
  await driver.wait(until.elementIsVisible(editButton))
  await editButton.click()
  const nameInput = await driver.wait(until.elementLocated(By.xpath(
    `//div[contains(@class, 'class:create-notepad-name-input:hWmi28rONe')]` +
    `//descendant::input`
  )))
  await driver.wait(until.elementIsVisible(nameInput))
  await nameInput.clear()
  await nameInput.sendKeys(newName)
  const confirmButton = await driver.wait(until.elementLocated(By.className('class:modal-confirm-button:fHIbu0jVfe')))
  await confirmButton.click()
}

export const deleteNotepad = async (
  driver: webdriver.ThenableWebDriver,
  name: string,
) => {
  const optionsButton = await driver.wait(until.elementLocated(By.xpath(
    `//*[contains(text(), '${name}')]` +
    `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]` +
    `//descendant::*[contains(@class, 'class:notepad-options-button:GrWzrbooC9')]`
  )))
  await driver.wait(until.elementIsVisible(optionsButton))
  await optionsButton.click()
  const deleteButton = await driver.wait(until.elementLocated(By.xpath(
    `//*[contains(text(), '${name}')]` +
    `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]` +
    `//descendant::*[contains(@class, 'class:notepad-options-delete-button:r6ukcuDrQL')]`
  )))
  await driver.wait(until.elementIsVisible(deleteButton))
  await deleteButton.click()
  const confirmButton = await driver.wait(until.elementLocated(By.className('class:modal-confirm-button:fHIbu0jVfe')))
  await driver.wait(until.elementIsVisible(confirmButton))
  await confirmButton.click()
}

export const getNotepads = async (
  driver:  webdriver.ThenableWebDriver,
) => {
  return (await driver.findElements(By.xpath(
    `//*[@id='id:notepad-list-container:7MLMomsYBt']` +
    `//descendant::*[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
  )))
}

export const countNotepads = async (
  driver:  webdriver.ThenableWebDriver,
) => {
  return (await driver.findElements(By.xpath(
    `//*[@id='id:notepad-list-container:7MLMomsYBt']` +
    `//descendant::*[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
  ))).length
}