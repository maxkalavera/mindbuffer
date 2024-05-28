/// <reference path="../globals.d.ts" />
import {describe, expect, test} from '@jest/globals';
import { By, until } from 'selenium-webdriver';
import { v4 as uuidv4 } from 'uuid';

import { createPage, updatePage, deletePage, countPages } from './pages.operations';
import { createNotepad } from './notepads.operations';

describe('Pages operations', () => {
  test('Page is added it\'s container when created', async () => {
    const driver = global.webdriver
    const notepadName = 'text:oqaTyRWhj5'
    const pageName = 'text:JfJF3rNfom'
    await createNotepad(driver, notepadName)
    await createPage(driver, notepadName, pageName)
    expect(
      await driver.findElements(By.xpath(
        `//*[contains(@class, 'class:page:8o3bzP8yoT')]` +
        `//descendant::*[contains(text(), '${pageName}')]`
      ))
    ).toHaveLength(1)
  })

  test('Page is modified from it\'s container when updated', async () => {
    const driver = global.webdriver
    const notepadName = 'text:nlYsA3rB31'
    const originalName = 'text:g5CtZHIxOv'
    const updatedName = 'text:w6XpzCK527'
    await createNotepad(driver, notepadName)
    await createPage(driver, notepadName, originalName)
    await updatePage(driver, originalName, updatedName)
    expect(
      await driver.findElements(By.xpath(
        `//*[contains(@class, 'class:page:8o3bzP8yoT')]` +
        `//descendant::*[contains(text(), '${originalName}')]`
      ))
    ).toHaveLength(0)
    expect(
      await driver.findElements(By.xpath(
        `//*[contains(@class, 'class:page:8o3bzP8yoT')]` +
        `//descendant::*[contains(text(), '${updatedName}')]`
      ))
    ).toHaveLength(1)
  })

  test('Page is removed from it\'s container when deleted', async () => {
    const driver = global.webdriver
    const notepadName = 'text:YsQ2dyt3HB'
    const pageName = 'text:T2snrtMcFR'
    await createNotepad(driver, notepadName)
    await createPage(driver, notepadName, pageName)
    await deletePage(driver, pageName)
    expect(
      await driver.findElements(By.xpath(
        `//*[contains(@class, 'class:page:8o3bzP8yoT')]` +
        `//descendant::*[contains(text(), '${pageName}')]`
      ))
    ).toHaveLength(0)
  })

  test('Page containers should paginate when there is too many items #RE7WsTQyCx', async () => {
    const driver = global.webdriver
    const notepadName = `text:${uuidv4()}`
    const pages = Array(75).fill(undefined).map(() => `text:${uuidv4()}`)
    await createNotepad(driver, notepadName)
    for(let i = 0; i < pages.length; i++) {
      await createPage(driver, notepadName, pages[i])
    }
    await driver.navigate().refresh()
    expect(await countPages(driver)).toEqual(50)

    await driver.executeScript(
      // pages are placed inside the same list that notepads
      `const notepadContainer = document.getElementById('id:notepad-list-container:7MLMomsYBt');` +
      `notepadContainer.scrollTo(0, notepadContainer.scrollHeight);`
    )
    await driver.wait(until.elementsLocated(By.xpath(
      `//*[@id='id:notepad-list-container:7MLMomsYBt']` +
      `//descendant::*[contains(text(),'${pages[pages.length - 1]}')]`
    )))
    expect(await countPages(driver)).toEqual(75)
  }, MEDIUM)
})
