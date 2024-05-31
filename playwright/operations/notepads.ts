import type { Page } from '@playwright/test';

export const createNotepad = async (
  page: Page,
  name: string,
) => {
  /*
  const createButton = await driver.wait(until.elementLocated(By.id('id:create-notepad-button:f9CFxx4pON')), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(createButton), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(createButton), WAIT_UNTIL_TIMEOUT)
  await createButton.click()
  const nameInput = await driver.wait(until.elementLocated(By.xpath(
    '//div[contains(@class, \'class:create-notepad-name-input:hWmi28rONe\')]' +
    '//descendant::input'
  )), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(nameInput), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(nameInput), WAIT_UNTIL_TIMEOUT)
  await nameInput.sendKeys(name)
  const confirmButton = await driver.wait(until.elementLocated(By.className('class:modal-confirm-button:fHIbu0jVfe')), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(confirmButton), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(confirmButton), WAIT_UNTIL_TIMEOUT)
  await confirmButton.click()
  */
}

export const updateNotepad = async (
  page: Page,
  name: string,
  newName: string,
) => {
  /*
  const optionsButton = await driver.wait(until.elementLocated(By.xpath(
    `//*[contains(text(), '${name}')]` +
    `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]` +
    `//descendant::*[contains(@class, 'class:notepad-options-button:GrWzrbooC9')]`
  )), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(optionsButton), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(optionsButton), WAIT_UNTIL_TIMEOUT)
  await optionsButton.click()
  const editButton = await driver.wait(until.elementLocated(By.xpath(
    `//*[contains(text(), '${name}')]` +
    `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]` +
    `//descendant::*[contains(@class, 'class:notepad-options-edit-button:OJSSF5T46S')]`
  )), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(editButton), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(editButton), WAIT_UNTIL_TIMEOUT)
  await editButton.click()
  const nameInput = await driver.wait(until.elementLocated(By.xpath(
    `//div[contains(@class, 'class:create-notepad-name-input:hWmi28rONe')]` +
    `//descendant::input`
  )), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(nameInput), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(nameInput), WAIT_UNTIL_TIMEOUT)
  await nameInput.clear()
  await nameInput.sendKeys(newName)
  const confirmButton = await driver.wait(
    until.elementLocated(By.className('class:modal-confirm-button:fHIbu0jVfe'))
  , WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(confirmButton), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(confirmButton), WAIT_UNTIL_TIMEOUT)
  await confirmButton.click()
  */
}

export const deleteNotepad = async (
  page: Page,
  name: string,
) => {
  /*
  const optionsButton = await driver.wait(until.elementLocated(By.xpath(
    `//*[contains(text(), '${name}')]` +
    `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]` +
    `//descendant::*[contains(@class, 'class:notepad-options-button:GrWzrbooC9')]`
  )))
  await driver.wait(until.elementIsVisible(optionsButton), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(optionsButton), WAIT_UNTIL_TIMEOUT)
  await optionsButton.click()
  const deleteButton = await driver.wait(until.elementLocated(By.xpath(
    `//*[contains(text(), '${name}')]` +
    `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]` +
    `//descendant::*[contains(@class, 'class:notepad-options-delete-button:r6ukcuDrQL')]`
  )), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(deleteButton), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(deleteButton), WAIT_UNTIL_TIMEOUT)
  await deleteButton.click()
  const confirmButton = await driver.wait(
    until.elementLocated(By.className('class:modal-confirm-button:fHIbu0jVfe')), WAIT_UNTIL_TIMEOUT)
    await driver.wait(until.elementIsVisible(confirmButton), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(confirmButton), WAIT_UNTIL_TIMEOUT)
  await confirmButton.click()
  */
}

/*
export const getNotepads = async (
  page: Page,
) => {
  return (await driver.findElements(By.xpath(
    `//*[@id='id:notepad-list-container:7MLMomsYBt']` +
    `//descendant::*[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
  )))
}
*/

export const countNotepads = async (
  page: Page,
) => {
  return await page.locator(
    `xpath=` +
    `//*[@id='id:notepad-list-container:7MLMomsYBt']` +
    `//descendant::*[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
  ).count();
}