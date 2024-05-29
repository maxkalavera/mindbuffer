/// <reference path="../globals.d.ts" />
import {describe, expect, test} from '@jest/globals';
import webdriver, { By, until } from 'selenium-webdriver'
import { v4 as uuidv4 } from 'uuid';

import emptyDatabase from './utils/emptyDatabase';
import seed from './utils/seed';
import {createNote, deleteNote, countNotes} from './notes.operations'

describe('Notes operations', () => {
  test('Note is added to note\'s board when created #hJh8yfxfy6', async () => {
    const driver = global.webdriver
    await emptyDatabase(global.queries)
    await driver.navigate().refresh()

    const textContent = 'text:Og7LikCQFm'
    await createNote(driver, textContent)
    expect(await driver.findElement(By.xpath(
      `//*[@id='id:notes-board:Y8FAln8HKV']` +
      `//descendant::*[contains(text(),'${textContent}')]`
    ))).toBeDefined()
  });

  test('Note is deleted when delete\'s operation is confirmed #HbHdvSxtjY', async () => {
    const driver = global.webdriver
    await emptyDatabase(global.queries)
    await seed(global.queries, 'HbHdvSxtjY')
    await driver.navigate().refresh()

    const textContent = 'text:NXIdNyzgq9'
    await deleteNote(driver, textContent)
    driver.findElement(By.xpath(
      `//*[@id='id:notes-board:Y8FAln8HKV']` +
      `//descendant::*[contains(text(),'${textContent}')]`
    )).catch(error => expect(error).toBeInstanceOf(webdriver.error.NoSuchElementError))
  });

  test('Notes board should paginate when there is too many items #E1qQS4raeE', async () => {
    const driver = global.webdriver
    await emptyDatabase(global.queries)
    await seed(global.queries, 'E1qQS4raeE')
    await driver.navigate().refresh()

    await driver.wait(until.elementLocated(By.xpath(
      `//*[contains(text(),'text:teoGsC8JN6')]`     
    )), WAIT_UNTIL_TIMEOUT)
    expect(await countNotes(driver)).toEqual(20)
    await driver.executeScript(
      `const notesBoard = document.getElementById('id:notes-board:Y8FAln8HKV');` +
      `notesBoard.scrollTo(0, 0);`
    )
    await driver.wait(
      until.elementsLocated(By.xpath(
        `//*[@id='id:notes-board:Y8FAln8HKV']` +
        `//descendant::*[contains(text(),'text:V5BfHdvxKv')]`
      ))
    , WAIT_UNTIL_TIMEOUT)    
    expect(await countNotes(driver)).toEqual(25)
  }, LONG_TIMEOUT);
});