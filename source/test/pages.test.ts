/// <reference path="../globals.d.ts" />
import {describe, expect, test} from '@jest/globals';
import webdriver, { By, until } from 'selenium-webdriver';
import { v4 as uuidv4, parse as uuidParse } from 'uuid';

import emptyDatabase from './utils/emptyDatabase';
import seed from './utils/seed';
import { createPage, updatePage, deletePage, countPages } from './pages.operations';
import { createNotepad } from './notepads.operations';

describe('Pages operations', () => {
  test('Page is added it\'s container when created #0Yu8lf8Q20', async () => {
    const driver = global.webdriver
    await emptyDatabase(global.queries)
    await seed(global.queries, '0Yu8lf8Q20')
    await driver.navigate().refresh()

    const notepadName = 'text:oqaTyRWhj5'
    const pageName = 'text:JfJF3rNfom'
    await createPage(driver, notepadName, pageName)
    expect(await driver.findElement(By.xpath(
      `//*[contains(@class, 'class:page:8o3bzP8yoT')]` +
      `//descendant::*[contains(text(), '${pageName}')]`
    ))).toBeDefined()
  })

  test('Page is modified from it\'s container when updated #k8Rzma7uDj', async () => {
    const driver = global.webdriver
    await emptyDatabase(global.queries)
    await seed(global.queries, 'k8Rzma7uDj')
    await driver.navigate().refresh()

    const originalName = 'text:g5CtZHIxOv'
    const updatedName = 'text:w6XpzCK527'
    await updatePage(driver, originalName, updatedName)
    driver.findElement(By.xpath(
      `//*[contains(@class, 'class:page:8o3bzP8yoT')]` +
      `//descendant::*[contains(text(), '${originalName}')]`
    )).catch(error => expect(error).toBeInstanceOf(webdriver.error.NoSuchElementError))
    expect(await driver.findElements(By.xpath(
      `//*[contains(@class, 'class:page:8o3bzP8yoT')]` +
      `//descendant::*[contains(text(), '${updatedName}')]`
    ))).toBeDefined()
  })

  test('Page is removed from it\'s container when deleted #CofA5PWDDT', async () => {
    const driver = global.webdriver
    await emptyDatabase(global.queries)
    await seed(global.queries, 'CofA5PWDDT')
    await driver.navigate().refresh()

    const pageName = 'text:T2snrtMcFR'
    await deletePage(driver, pageName)
    driver.findElement(By.xpath(
      `//*[contains(@class, 'class:page:8o3bzP8yoT')]` +
      `//descendant::*[contains(text(), '${pageName}')]`
    )).catch(error => expect(error).toBeInstanceOf(webdriver.error.NoSuchElementError))
  })

  test('Page containers should paginate when there is too many items #RE7WsTQyCx', async () => {
    const driver = global.webdriver
    await emptyDatabase(global.queries)
    await seed(global.queries, 'RE7WsTQyCx')
    await driver.navigate().refresh()

    expect(await countPages(driver)).toEqual(50)
    await driver.executeScript(
      // pages are placed inside the same list that notepads
      `const notepadContainer = document.getElementById('id:notepad-list-container:7MLMomsYBt');` +
      `notepadContainer.scrollTo(0, notepadContainer.scrollHeight);`
    )
    await driver.wait(until.elementsLocated(By.xpath(
      `//*[@id='id:notepad-list-container:7MLMomsYBt']` +
      `//descendant::*[contains(text(),'text:269dc6a2b6')]`
    )), WAIT_UNTIL_TIMEOUT)
    expect(await countPages(driver)).toEqual(75)
  }, LONG_TIMEOUT)
})
