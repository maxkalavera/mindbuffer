import webdriver, { By, until } from 'selenium-webdriver'

export const createNote = async (
  driver: webdriver.ThenableWebDriver,
  content: string,
) => {
  const textArea = await driver.wait(until.elementLocated(By.id('id:create-note-textarea:ZtAZE54FsV')))
  await driver.wait(until.elementIsVisible(textArea))
  await driver.wait(until.elementIsEnabled(textArea))
  await textArea.sendKeys(content)
  const sendButton = await driver.findElement(By.id('id:create-note-button:j2OnOhuazV'))
  await driver.wait(until.elementIsVisible(sendButton))
  await driver.wait(until.elementIsEnabled(sendButton))
  await sendButton.click()
}

export const deleteNote = async (
  driver: webdriver.ThenableWebDriver,
  content: string,
) => {
  const createdNote = await driver.wait(until.elementLocated(By.xpath(
    `//*[contains(text(),'${content}')]` +
    `//ancestor::div[contains(@class, 'class:text-note:7BoiMerq5D')]`
  )))
  await driver.wait(until.elementIsVisible(createdNote))
  expect(createdNote).not.toBeUndefined()
  expect((await createdNote.getText()).includes(content)).toBeTruthy()
  const optionsButton = await driver.wait(until.elementLocated(By.className('class:note-options-button:TMKI1oxDBJ')))
  await driver.wait(until.elementIsVisible(optionsButton))
  await driver.wait(until.elementIsEnabled(optionsButton))
  await optionsButton.click()
  const deleteButton = await driver.wait(until.elementLocated(By.className('class:note-options-delete-button:CEXEVxvbnV')))
  await driver.wait(until.elementIsVisible(deleteButton))
  await driver.wait(until.elementIsEnabled(deleteButton))
  await deleteButton.click()
  const confirmButton = await driver.wait(until.elementLocated(By.className('class:modal-confirm-button:fHIbu0jVfe')))
  await driver.wait(until.elementIsVisible(confirmButton))
  await driver.wait(until.elementIsEnabled(confirmButton))
  await confirmButton.click()
}

export const countNotes = async (
  driver: webdriver.ThenableWebDriver,
) => {
  return (await driver.findElements(By.xpath(
      `//*[@id='id:notes-board:Y8FAln8HKV']` +
      `//descendant::*[contains(@class, 'class:text-note:7BoiMerq5D')]`
  ))).length
}