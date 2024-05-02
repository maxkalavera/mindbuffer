import webdriver, { By } from 'selenium-webdriver'

export const createNote = async (
  driver: webdriver.ThenableWebDriver,
  content: string,
) => {
  const textArea = await driver.findElement(By.id('id:create-note-textarea:ZtAZE54FsV'))
  await textArea.sendKeys(content)
  const sendButton = await driver.findElement(By.id('id:create-note-button:j2OnOhuazV'))
  await sendButton.click()
}

export const deleteNote = async (
  driver: webdriver.ThenableWebDriver,
  content: string,
) => {
  const notesBoard = await driver.findElement(By.id('id:notes-board:Y8FAln8HKV'))
  const createdNote = await notesBoard.findElement(By.xpath(
    `//*[contains(text(),'${content}')]` +
    `//ancestor::div[contains(@class, 'class:text-note:7BoiMerq5D')]`
  ))
  expect(createdNote).not.toBeUndefined()
  expect((await createdNote.getText()).includes(content)).toBeTruthy()
  const optionsButton = await createdNote.findElement(By.className('class:note-options-button:TMKI1oxDBJ'))
  await optionsButton.click()
  const deleteButton = await createdNote.findElement(By.className('class:note-options-delete-button:CEXEVxvbnV'))
  await deleteButton.click()
  const confirmButton = await driver.findElement(By.className('class:modal-confirm-button:fHIbu0jVfe'))
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