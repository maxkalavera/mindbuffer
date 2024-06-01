import { expect } from '@playwright/test';
import { test } from './utils/test';
import { createPage, updatePage, deletePage, countPages } from './operations/pages';

test('Page is added it\'s container when created #0Yu8lf8Q20', async ({ launchElectron }) => {
  for await (const page of launchElectron('0Yu8lf8Q20')) {
    const notepadName = 'text:oqaTyRWhj5';
    const pageName = 'text:JfJF3rNfom';
    await createPage(page, notepadName, pageName);
    expect(await page.locator(
      'xpath=' + 
      `//*[contains(@class, 'class:page:8o3bzP8yoT')]` +
      `//descendant::*[contains(text(), '${pageName}')]`
    )).toBeDefined();
  }
})

test('Page is modified from it\'s container when updated #k8Rzma7uDj', async ({ launchElectron }) => {
  for await (const page of launchElectron('k8Rzma7uDj')) {
    const originalName = 'text:g5CtZHIxOv';
    const updatedName = 'text:w6XpzCK527';
    await updatePage(page, originalName, updatedName);
    await page.locator(
      'xpath=' + 
      `//*[contains(@class, 'class:page:8o3bzP8yoT')]` +
      `//descendant::*[contains(text(), '${originalName}')]`
    ).waitFor({ state: 'detached' });
    expect(await page.locator(
      'xpath=' + 
      `//*[contains(@class, 'class:page:8o3bzP8yoT')]` +
      `//descendant::*[contains(text(), '${originalName}')]`
    ).count()).toEqual(0);
    expect(await page.locator(
      'xpath=' + 
      `//*[contains(@class, 'class:page:8o3bzP8yoT')]` +
      `//descendant::*[contains(text(), '${updatedName}')]`
    )).toBeDefined();
  }
})

test('Page is removed from it\'s container when deleted #CofA5PWDDT', async ({ launchElectron }) => {
  for await (const page of launchElectron('CofA5PWDDT')) {
    const pageName = 'text:T2snrtMcFR'
    await deletePage(page, pageName);
    await page.locator(
      'xpath=' + 
      `//*[contains(@class, 'class:page:8o3bzP8yoT')]` +
      `//descendant::*[contains(text(), '${pageName}')]`
    ).waitFor({ state: 'detached' });
    expect(await page.locator(
      'xpath=' + 
      `//*[contains(@class, 'class:page:8o3bzP8yoT')]` +
      `//descendant::*[contains(text(), '${pageName}')]`
    ).count()).toEqual(0);
  }
})

test('Page containers should paginate when there is too many items #RE7WsTQyCx', async ({ launchElectron }) => {
  for await (const page of launchElectron('RE7WsTQyCx')) {
    await page.locator(
      'xpath=' +
      `//*[@id='id:notepad-list-container:7MLMomsYBt']` +
      `//descendant::*[contains(text(),'text:c2852ca76b')]`
    ).waitFor({state: 'visible'});
    expect(await countPages(page)).toEqual(50);
    // Scroll to bottom
    await page.locator(`xpath=//*[@id='id:notepad-list-container:7MLMomsYBt']`).evaluate((node) => {
      node.scrollTo(0, node.scrollHeight);
    });
    await page.locator(
      'xpath=' +
      `//*[@id='id:notepad-list-container:7MLMomsYBt']` +
      `//descendant::*[contains(text(),'text:269dc6a2b6')]`
    ).waitFor({state: 'visible'});
    expect(await countPages(page)).toEqual(75);
  }
});