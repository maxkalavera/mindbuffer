import { expect } from '@playwright/test';
import { test } from './utils/test';
import {createNote, deleteNote, countNotes} from './operations/notes';
import type { Page } from '@playwright/test';

test('Note is added to note\'s board when created #hJh8yfxfy6', async () => {
  /*
  const textContent = 'text:Og7LikCQFm'
  await createNote(driver, textContent)
  expect(await driver.findElement(By.xpath(
    `//*[@id='id:notes-board:Y8FAln8HKV']` +
    `//descendant::*[contains(text(),'${textContent}')]`
  ))).toBeDefined()
  */
});

test('Note is deleted when delete\'s operation is confirmed #HbHdvSxtjY', async () => {
  /*
  const textContent = 'text:NXIdNyzgq9'
  await deleteNote(driver, textContent)
  driver.findElement(By.xpath(
    `//*[@id='id:notes-board:Y8FAln8HKV']` +
    `//descendant::*[contains(text(),'${textContent}')]`
  )).catch(error => expect(error).toBeInstanceOf(webdriver.error.NoSuchElementError))
  */
});

test('Notes board should paginate when there is too many items #E1qQS4raeE', async () => {
  /*
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
  */
});