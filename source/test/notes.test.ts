/// <reference path="../globals.d.ts" />
import {describe, expect, test} from '@jest/globals';
import { By, until } from 'selenium-webdriver'
import { v4 as uuidv4 } from 'uuid';

import {createNote, deleteNote, countNotes} from './notes.operations'

describe('Notes operations', () => {
  test('Note is added to note\'s board when created', async () => {
    const driver = global.webdriver
    const textContent = 'text:Og7LikCQFm'
    await createNote(driver, textContent)
    {
      const notesBoard = await driver.findElement(By.id('id:notes-board:Y8FAln8HKV'))
      const notesBoardTextContent = await notesBoard.getText()
      expect(notesBoardTextContent.includes(textContent)).toBeTruthy()
    }
  });

  test('Note is deleted when delete\'s operation is confirmed', async () => {
    const driver = global.webdriver
    const textContent = 'text:NXIdNyzgq9'
    await createNote(driver, textContent)
    await deleteNote(driver, textContent)
    {
      const notesBoard = await driver.findElement(By.id('id:notes-board:Y8FAln8HKV'))
      const notesBoardTextContent = await notesBoard.getText()
      expect(notesBoardTextContent.includes(textContent)).not.toBeTruthy()
    }
  });

  test('Notes board should paginate when there is too many items #E1qQS4raeE', async () => {
    const driver = global.webdriver
    const notes = Array(25).fill(undefined).map(() => `text:${uuidv4()}`)
    for(let i = 0; i < notes.length; i++) {
      await createNote(driver, notes[i])
    }
    await driver.wait(until.elementLocated(By.xpath(
      `//*[contains(text(),'${notes[notes.length - 1]}')]`     
    )), 3000)
    await driver.navigate().refresh()
    await driver.wait(until.elementLocated(By.xpath(
      `//*[contains(text(),'${notes[0]}')]`     
    )), 3000)
    expect(await countNotes(driver)).toEqual(20)
    await driver.executeScript(
      `const notesBoard = document.getElementById('id:notes-board:Y8FAln8HKV');` +
      `notesBoard.scrollTo(0, 0);`
    )
    await driver.wait(
      until.elementsLocated(By.xpath(
        `//*[@id='id:notes-board:Y8FAln8HKV']` +
        `//descendant::*[contains(text(),'${notes[notes.length - 1]}')]`
      ))
    )    
    expect(await countNotes(driver)).toEqual(25)
  }, MEDIUM);
});