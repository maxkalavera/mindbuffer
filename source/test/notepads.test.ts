/// <reference path="../globals.d.ts" />
import {describe, expect, test} from '@jest/globals';
import webdriver, { By, until } from 'selenium-webdriver';
import { v4 as uuidv4 } from 'uuid';

import seed from './utils/seed';
import emptyDatabase from './utils/emptyDatabase';
import { createNotepad, updateNotepad, deleteNotepad, countNotepads } from './notepads.operations'

describe('Notepads operations', () => {
  test('Notepad is added it\'s container when created #EnnXQW3AYD', async () => {
    const driver = global.webdriver
    await emptyDatabase(global.queries)
    await driver.navigate().refresh()

    const name = 'text:bK5oaojDzQ'
    await createNotepad(driver, name)
    expect(await driver.findElement(By.xpath(
      `//*[contains(text(),'${name}')]` +
      `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
    ))).toBeDefined()
  })

  test('Notepad is modified from it\'s container when updated #KR3ZMLAgsk', async () => {
    const driver = global.webdriver
    await emptyDatabase(global.queries)
    await seed(global.queries, 'KR3ZMLAgsk')
    await driver.navigate().refresh()

    const originalName = 'text:3OxLimFmdA'
    const updatedName = 'text:txg393ydXN'
    // Check original note was seeded correctly
    expect(await driver.findElement(By.xpath(
      `//*[contains(text(),'${originalName}')]` +
      `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
    ))).toBeDefined()
    await updateNotepad(driver, originalName, updatedName)
    driver.findElement(By.xpath(
      `//*[contains(text(),'${originalName}')]` +
      `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
    )).catch((error) => expect(error).toBeInstanceOf(webdriver.error.NoSuchElementError))
    expect(await driver.findElements(By.xpath(
      `//*[contains(text(),'${updatedName}')]` +
      `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
    ))).toBeDefined()
  })

  test('Notepad is removed from it\'s container when deleted #qgZ84s8G0C', async () => {
    const driver = global.webdriver as webdriver.ThenableWebDriver
    await emptyDatabase(global.queries)
    await seed(global.queries, 'qgZ84s8G0C')
    await driver.navigate().refresh()

    const name = 'text:vfzbE9RYPL'
    expect(await driver.findElement(By.xpath(
      `//*[contains(text(),'${name}')]` +
      `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
    ))).toBeDefined()
    await deleteNotepad(driver, name)
    driver.findElement(By.xpath(
      `//*[contains(text(),'${name}')]` +
      `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
    )).catch(error => expect(error).toBeInstanceOf(webdriver.error.NoSuchElementError))
  })

  test('Notepad container should paginate when there is too many items #5MG57jsx1u', async () => {
    const driver = global.webdriver
    await emptyDatabase(global.queries)
    await seed(global.queries, '5MG57jsx1u')
    await driver.navigate().refresh()

    await driver.wait(until.elementLocated(By.xpath(
      `//*[contains(text(),'text:FQigMfgR2T')]`
    )), WAIT_UNTIL_TIMEOUT)
    expect(await countNotepads(driver)).toEqual(20)
    await driver.executeScript(
      `const notepadContainer = document.getElementById('id:notepad-list-container:7MLMomsYBt');` +
      `notepadContainer.scrollTo(0, notepadContainer.scrollHeight);`
    )
    await driver.wait(until.elementLocated(By.xpath(
      `//*[@id='id:notepad-list-container:7MLMomsYBt']` +
      `//descendant::*[contains(text(),'text:sgKR3U3i2Y')]`
    )), WAIT_UNTIL_TIMEOUT)
    expect(await countNotepads(driver)).toEqual(25)
  }, LONG_TIMEOUT)
})
