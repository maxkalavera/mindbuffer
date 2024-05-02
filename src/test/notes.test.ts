import {describe, expect, test} from '@jest/globals';
import webdriver, { By, Key, until } from 'selenium-webdriver'
import { v4 as uuidv4 } from 'uuid';

import {createNote, deleteNote, countNotes} from './notes.operations'

const driverRef: {current: webdriver.ThenableWebDriver} = {current: undefined}

describe('Notes operations', () => {
  beforeEach(() => {
    driverRef.current = new webdriver.Builder()
      .usingServer('http://localhost:9515')
      .withCapabilities({
        'goog:chromeOptions': {
          binary: global.__BINARY_PATH__,
        }
      })
      .forBrowser('chrome')
      .build()
  });
  afterEach(async () => {
    await driverRef.current.quit()
  });
  test('Note is added to note\'s board when created', async () => {
    const textContent = 'text:Og7LikCQFm'
    const driver = driverRef.current
    await createNote(driver, textContent)
    {
      const notesBoard = await driver.findElement(By.id('id:notes-board:Y8FAln8HKV'))
      const notesBoardTextContent = await notesBoard.getText()
      expect(notesBoardTextContent.includes(textContent)).toBeTruthy()
    }
  });
  test('Note is deleted when delete\'s operation is confirmed', async () => {
    const textContent = 'text:NXIdNyzgq9'
    const driver = driverRef.current
    await createNote(driver, textContent)
    await deleteNote(driver, textContent)
    {
      const notesBoard = await driver.findElement(By.id('id:notes-board:Y8FAln8HKV'))
      const notesBoardTextContent = await notesBoard.getText()
      expect(notesBoardTextContent.includes(textContent)).not.toBeTruthy()
    }
  });
  test('Notes board should paginate when there is too many items', async () => {
    const notes = Array(25).fill(undefined).map(() => `text:${uuidv4()}`)
    const driver = driverRef.current
    for(let i = 0; i < notes.length; i++) {
      await createNote(driver, notes[i])
    }
    await driver.navigate().refresh()
    expect(await countNotes(driver)).toEqual(20)
    await driver.executeScript(
      `const notesBoard = document.getElementById('id:notes-board:Y8FAln8HKV');` +
      `notesBoard.scrollTo(0, 0);`
    )
    await driver.wait(
      until.elementsLocated(By.xpath(
        `//*[@id='id:notes-board:Y8FAln8HKV']` +
        `//descendant::*[contains(text(),'${notes[0]}')]`
      ))
    )    
    expect(await countNotes(driver)).toEqual(25)
  }, 10000);
});