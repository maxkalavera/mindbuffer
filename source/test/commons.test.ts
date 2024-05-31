/// <reference path="../globals.d.ts" />
import {describe, expect, test} from '@jest/globals';
import webdriver, { By, until } from 'selenium-webdriver'

import seed from './utils/seed';
import emptyDatabase from './utils/emptyDatabase';
import { countNotes } from './notes.operations'
import { countNotepads } from './notepads.operations'
import { countPages } from './pages.operations'

const search = async (
  driver: webdriver.ThenableWebDriver,
  content: string,
) => {
  const searchInput = await driver.wait(until.elementLocated(By.id('id:searchbar-input:aPNkesepop')))
  await driver.wait(until.elementIsVisible(searchInput))
  await driver.wait(until.elementIsEnabled(searchInput))
  await searchInput.sendKeys(content)
  const sendSearchButton = await driver.wait(until.elementLocated(By.id('id:searchbar-send-button:OGUB40c5DM')))
  await driver.wait(until.elementIsVisible(sendSearchButton))
  await driver.wait(until.elementIsEnabled(sendSearchButton))
  await sendSearchButton.click()
}

const clearSearch = async (
  driver: webdriver.ThenableWebDriver,
) => {
  const clearSearchButton = await driver.wait(until.elementLocated(By.id('id:searchbar-clear-button:KlsiLQF3zr')))
  await driver.wait(until.elementIsVisible(clearSearchButton))
  await driver.wait(until.elementIsEnabled(clearSearchButton))
  await clearSearchButton.click()
}

describe('General operations', () => {
  test('Search should filter items by its keywords #6LGdgVNDb0', async () => {
    const driver = global.webdriver
    await emptyDatabase(global.queries)
    await seed(global.queries, '6LGdgVNDb0')
    await driver.navigate().refresh()

    // Search for multiple items
    await search(driver, 'text')
    await driver.wait(until.elementLocated(By.xpath(
        `//*[contains(text(),'text:04v3yu51Hh')]`     
    )), WAIT_UNTIL_TIMEOUT)
    expect(await countNotepads(driver)).toEqual(5)
    expect(await countPages(driver)).toEqual(5)
    expect(await countNotes(driver)).toEqual(5)
    await clearSearch(driver)
    // Search for specific item
    await search(driver, 'text:jq7UI8KMvB')
    await driver.wait(until.elementLocated(By.xpath(
      `//*[contains(text(),'text:jq7UI8KMvB')]`
    )), WAIT_UNTIL_TIMEOUT)
    expect(await countNotepads(driver)).toEqual(1)
    expect(await countPages(driver)).toEqual(1)
    expect(await countNotes(driver)).toEqual(1)
  })
})