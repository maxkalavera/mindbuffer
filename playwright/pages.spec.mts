import { expect } from '@playwright/test';
import { test } from './utils/test';
import { createPage, updatePage, deletePage, countPages } from './operations/pages';
import { createNotepad } from './operations/notepads';
import type { Page } from '@playwright/test';

test('Page is added it\'s container when created #0Yu8lf8Q20', async () => {
  /*
  const notepadName = 'text:oqaTyRWhj5'
  const pageName = 'text:JfJF3rNfom'
  await createPage(driver, notepadName, pageName)
  expect(await driver.findElement(By.xpath(
    `//*[contains(@class, 'class:page:8o3bzP8yoT')]` +
    `//descendant::*[contains(text(), '${pageName}')]`
  ))).toBeDefined()
  */
})

test('Page is modified from it\'s container when updated #k8Rzma7uDj', async () => {
  /*
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
  */
})

test('Page is removed from it\'s container when deleted #CofA5PWDDT', async () => {
  /*
  const pageName = 'text:T2snrtMcFR'
  await deletePage(driver, pageName)
  driver.findElement(By.xpath(
    `//*[contains(@class, 'class:page:8o3bzP8yoT')]` +
    `//descendant::*[contains(text(), '${pageName}')]`
  )).catch(error => expect(error).toBeInstanceOf(webdriver.error.NoSuchElementError))
  */
})

test('Page containers should paginate when there is too many items #RE7WsTQyCx', async () => {
  /*
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
  */
});