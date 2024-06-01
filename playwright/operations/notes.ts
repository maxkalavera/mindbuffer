import type { Page } from '@playwright/test';

export const createNote = async (
  page: Page,
  content: string,
) => {
    // Set search text into search bar
    await page.locator(`xpath=//*[@id='id:create-note-textarea:ZtAZE54FsV']`).fill(content);
    // Click search button
    await page.locator(`xpath=//*[@id='id:create-note-button:j2OnOhuazV']`).click();
}

export const deleteNote = async (
  page: Page,
  content: string,
) => {
  // Click specific notepad options button
  await page.locator(
    'xpath=' +
    `//*[contains(text(),'${content}')]` +
    `//ancestor::div[contains(@class, 'class:text-note:7BoiMerq5D')]` +
    `//descendant::*[contains(@class, 'class:note-options-button:TMKI1oxDBJ')]`
  ).click();
  // Click delete option
  await page.locator(
    'xpath=' +
    `//*[contains(text(),'${content}')]` +
    `//ancestor::div[contains(@class, 'class:text-note:7BoiMerq5D')]` +
    `//descendant::*[contains(@class, 'class:note-options-delete-button:CEXEVxvbnV')]`
  ).click();
  // Click confirm button
  await page.locator(`xpath=//*[contains(@class, 'class:modal-confirm-button:fHIbu0jVfe')]`).click();

  /*
  const createdNote = await driver.wait(until.elementLocated(By.xpath(
    `//*[contains(text(),'${content}')]` +
    `//ancestor::div[contains(@class, 'class:text-note:7BoiMerq5D')]`
  )), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(createdNote), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(createdNote), WAIT_UNTIL_TIMEOUT)
  expect(createdNote).not.toBeUndefined()

  expect((await createdNote.getText()).includes(content)).toBeTruthy()
  const optionsButton = await driver.wait(until.elementLocated(By.className('class:note-options-button:TMKI1oxDBJ')), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(optionsButton), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(optionsButton), WAIT_UNTIL_TIMEOUT)
  await optionsButton.click()
  const deleteButton = await driver.wait(until.elementLocated(By.className('class:note-options-delete-button:CEXEVxvbnV')), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(deleteButton), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(deleteButton), WAIT_UNTIL_TIMEOUT)
  await deleteButton.click()
  const confirmButton = await driver.wait(until.elementLocated(By.className('class:modal-confirm-button:fHIbu0jVfe')), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsVisible(confirmButton), WAIT_UNTIL_TIMEOUT)
  await driver.wait(until.elementIsEnabled(confirmButton), WAIT_UNTIL_TIMEOUT)
  await confirmButton.click()
  */
}

export const countNotes = async (
  page: Page,
) => {
  return await page.locator(
    `xpath=` +
    `//*[@id='id:notes-board:Y8FAln8HKV']` +
    `//descendant::*[contains(@class, 'class:text-note:7BoiMerq5D')]`
  ).count();
}