/// <reference path="../globals.d.ts" />
import {describe, expect, test} from '@jest/globals';
import { By, until } from 'selenium-webdriver';
import { v4 as uuidv4 } from 'uuid';

import { createNotepad, updateNotepad, deleteNotepad, countNotepads } from './notepads.operations'

describe('Notepads operations', () => {
  test('Notepad is added it\'s container when created', async () => {
    const driver = global.webdriver
    const name = 'text:bK5oaojDzQ'
    await createNotepad(driver, name)
    expect(await driver.findElements(By.xpath(
      `//*[contains(text(),'${name}')]` +
      `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
    ))).toHaveLength(1)
  })

  test('Notepad is modified from it\'s container when updated', async () => {
    const driver = global.webdriver
    const originalName = 'text:NWwVUyjCGx'
    const updatedName = 'text:txg393ydXN'
    await createNotepad(driver, originalName)
    expect(await driver.findElements(By.xpath(
      `//*[contains(text(),'${originalName}')]` +
      `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
    ))).toHaveLength(1)
    await updateNotepad(driver, originalName, updatedName)
    expect(await driver.findElements(By.xpath(
      `//*[contains(text(),'${originalName}')]` +
      `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
    ))).toHaveLength(0)
    expect(await driver.findElements(By.xpath(
      `//*[contains(text(),'${updatedName}')]` +
      `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
    ))).toHaveLength(1)
  })

  test('Notepad is removed from it\'s container when deleted #qgZ84s8G0C', async () => {
    const driver = global.webdriver
    const name = 'text:vfzbE9RYPL'
    await createNotepad(driver, name)
    expect(await driver.findElements(By.xpath(
      `//*[contains(text(),'${name}')]` +
      `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
    ))).toHaveLength(1)
    await deleteNotepad(driver, name)
    expect(await driver.findElements(By.xpath(
      `//*[contains(text(),'${name}')]` +
      `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
    ))).toHaveLength(0)
  })

  test('Notepad container should paginate when there is too many items #5MG57jsx1u', async () => {
    const driver = global.webdriver
    const notepads = Array(25).fill(undefined).map(() => `text:${uuidv4()}`)
    for(let i = 0; i < notepads.length; i++) {
      await createNotepad(driver, notepads[i])
    }

    await driver.wait(until.elementLocated(By.xpath(
      `//*[contains(text(),'${notepads[notepads.length - 1]}')]`     
    )), WAIT_UNTIL_TIMEOUT)
    await driver.navigate().refresh()
    await driver.wait(until.elementLocated(By.xpath(
      `//*[contains(text(),'${notepads[0]}')]`
    )), WAIT_UNTIL_TIMEOUT)
    expect(await countNotepads(driver)).toEqual(20)
    await driver.executeScript(
      `const notepadContainer = document.getElementById('id:notepad-list-container:7MLMomsYBt');` +
      `notepadContainer.scrollTo(0, notepadContainer.scrollHeight);`
    )
    await driver.wait(until.elementLocated(By.xpath(
      `//*[@id='id:notepad-list-container:7MLMomsYBt']` +
      `//descendant::*[contains(text(),'${notepads[notepads.length - 1]}')]`
    )), WAIT_UNTIL_TIMEOUT)
    expect(await countNotepads(driver)).toEqual(25)
  }, LONG_TIMEOUT)
})
