import {describe, expect, test} from '@jest/globals';
import webdriver, { By, Key, until } from 'selenium-webdriver'

const driverRef: {current: webdriver.ThenableWebDriver} = {current: undefined}

const createNote = async (
  driver: webdriver.ThenableWebDriver,
  content: string,
) => {
  const textArea = await driver.findElement(By.id('id:f5bf4eb14a1a456a9469f4283144a5b3'))
  await textArea.sendKeys(content)
  const sendButton = await driver.findElement(By.id('id:6d8920a3354b43feaf3d60dbc743e1de'))
  await sendButton.click()
}

const deleteNote = async (
  driver: webdriver.ThenableWebDriver,
  content: string,
) => {
  const notesBoard = await driver.findElement(By.id('id:56612895d6e043de89585c2aafbf776e'))
  const createdNote = await notesBoard.findElement(
    By.xpath(`//*[contains(text(),'${content}')]//ancestor::div[contains(@class, 'class:88ca791f00cd44539162be4e1c7a30eb')]`
  ))
  expect(createdNote).not.toBeUndefined()
  expect((await createdNote.getText()).includes(content)).toBeTruthy()
  const optionsButton = await createdNote.findElement(By.className('class:0c7cb38404c34f6ba51ebe56b10b142f'))
  await optionsButton.click()
  const deleteButton = await createdNote.findElement(By.className('class:8c80d40c1eee414cbdab38ddca3130e5'))
  await deleteButton.click()
  const confirmButton = await driver.findElement(By.className('class:6012f7869d934c888ac9711da2eb0db7'))
  await confirmButton.click()
}

const countNotesOnBoard = async (
  driver: webdriver.ThenableWebDriver,
) => {
  return (await driver.findElements(
    By.xpath(`//*[@id='id:56612895d6e043de89585c2aafbf776e']//descendant::*[contains(@class, 'class:88ca791f00cd44539162be4e1c7a30eb')]`)
  )).length
}

describe('Notes operations', () => {
  beforeAll(() => {
    driverRef.current = new webdriver.Builder()
    .usingServer('http://localhost:9515')
    .withCapabilities({
      'goog:chromeOptions': {
        binary: global.__BINARY_PATH__
      }
    })
    .forBrowser('chrome')
    .build()
  });
  afterAll(async () => {
    //await driverRef.current.quit()
  });
  test('note is added to note\'s board when sent', async () => {
    const textContent = 'text:ff7e42cb7e49432e8e8024c650eea7c0'
    const driver = driverRef.current
    await createNote(driver, textContent)
    {
      const notesBoard = await driver.findElement(By.id('id:56612895d6e043de89585c2aafbf776e'))
      const notesBoardTextContent = await notesBoard.getText()
      expect(notesBoardTextContent.includes(textContent)).toBeTruthy()
    }
  });
  test('note is deleted when delete\'s operation is confirmed', async () => {
    const textContent = 'text:8591f61d054842508a42821a0fb22dc0'
    const driver = driverRef.current
    await createNote(driver, textContent)
    await deleteNote(driver, textContent)
    {
      const notesBoard = await driver.findElement(By.id('id:56612895d6e043de89585c2aafbf776e'))
      const notesBoardTextContent = await notesBoard.getText()
      expect(notesBoardTextContent.includes(textContent)).not.toBeTruthy()
    }
  });
  test('notes board should paginate when there is too many items', async () => {
    const notes = [
      'text:e900e1e563094a86b3ae225accf5b73d',
      'text:989c347424b744ba9173cdb5c3991d66',
      'text:726c25d84aea4fad9644345d032bff79',
      'text:f34a027c61324eb0b8c41347b7367dd2',
      'text:7460c2b16af94443a66e856f17f35860',
      'text:d98e42f44e9c43ad87cbe1f54c9af7c9',
      'text:2f704429e3b14ab5ae7ebf8c1481eebf',
      'text:4bed96c04227447188547fe2d61aae46',
      'text:45066485d4404e739ef1ba6fec3ae4b6',
      'text:ec8e8cbc1c7d4821b4f381840cda7b2e',
      'text:c8d627a8ee3e4395835ef30b1e4eebf1',
      'text:2810d0f562d54646a46feae4937004e8',
      'text:d5e35af955c441adbadb1b23477abed2',
      'text:db8c7921d368456aaa8fa1bb49a21cb1',
      'text:c341b70f21a046a78aaa717c651aef91',
      'text:26301bf688ff411cbdc93b3eb84fda44',
      'text:4372ba35d81243fc8e81b348cf151c7e',
      'text:f47f85c52191460980a4a059e9159e5c',
      'text:9e20839fe3ea471fb8abdf285d87b4f9',
      'text:d4ec7855ba6c408aba35dc194e8f6022',
      'text:b4b4f2b7a0d34e0da086cfd9b430c4b9',
      'text:e03a1b60361a41f5a99ced0c9f799d41',
      'text:ca9a74061a28432596c61185e5bf9a6c',
      'text:840f3064e47946038b91b8ea32104fff',
      'text:5415c001f4d94e32b1efe8200a8957a1',
    ]
    const driver = driverRef.current
    for(let i = 0; i < notes.length; i++) {
      await createNote(driver, notes[i])
    }
    await driver.navigate().refresh()
    expect(await countNotesOnBoard(driver)).toEqual(20)
    await driver.executeScript(`
      const notesBoard = document.getElementById('id:56612895d6e043de89585c2aafbf776e');
      notesBoard.scrollTo(0, 0);
    `)
    await driver.wait(until.elementsLocated(
      By.xpath(`//*[@id='id:56612895d6e043de89585c2aafbf776e']//descendant::*[contains(text(),'${notes[0]}')]`)
    ))
    expect(await countNotesOnBoard(driver)).toEqual(25)
  });
});