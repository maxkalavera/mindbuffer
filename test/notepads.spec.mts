import { expect } from '@playwright/test';
import { test } from './utils/test';

import { createNotepad, updateNotepad, deleteNotepad, countNotepads } from './operations/notepads'

test('Notepad is added it\'s container when created #EnnXQW3AYD', async ({ launchElectron }) => {
  for await (const page of launchElectron()) {
    const name = 'text:bK5oaojDzQ';
    await createNotepad(page, name);
    expect(await page.locator(
      'xpath=' + 
      `//*[contains(text(),'${name}')]` +
      `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
    )).toBeDefined();
  }
});

test('Notepad is modified from it\'s container when updated #KR3ZMLAgsk', async ({ launchElectron }) => {
  for await (const page of launchElectron('KR3ZMLAgsk')) {
    const originalName = 'text:3OxLimFmdA'
    const updatedName = 'text:txg393ydXN'
    await updateNotepad(page, originalName, updatedName);
    // Wait for the page to update
    await page.locator(
      'xpath=' + 
      `//*[contains(text(),'${originalName}')]` +
      `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
    ).waitFor({ state: 'detached' });
    expect(await page.locator(
      'xpath=' + 
      `//*[contains(text(),'${originalName}')]` +
      `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
    ).count()).toEqual(0);
    expect(await page.locator(
      'xpath=' + 
      `//*[contains(text(),'${updatedName}')]` +
      `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
    )).toBeDefined();
  }
});

test('Notepad is removed from it\'s container when deleted #qgZ84s8G0C', async ({ launchElectron }) => {
  for await (const page of launchElectron('qgZ84s8G0C')) {
    const name = 'text:vfzbE9RYPL';
    await deleteNotepad(page, name);
    await page.locator(
      'xpath=' + 
      `//*[contains(text(),'${name}')]` +
      `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
    ).waitFor({ state: 'detached' });
    expect(await page.locator(
      'xpath=' + 
      `//*[contains(text(),'${name}')]` +
      `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]`
    ).count()).toEqual(0);
  }
});

test('Notepad container should paginate when there is too many items #5MG57jsx1u', async ({ launchElectron }) => {
  for await (const page of launchElectron('5MG57jsx1u')) {
    await page.locator(
      'xpath=' +
      `//*[contains(text(),'text:FQigMfgR2T')]`
    ).waitFor({state: 'visible'});
    expect(await countNotepads(page)).toEqual(20);
    // Scroll to bottom
    await page.locator(`xpath=//*[@id='id:notepad-list-container:7MLMomsYBt']`).evaluate((node) => {
      node.scrollTo(0, node.scrollHeight);
    });
    await page.locator(
      'xpath=' +
      `//*[contains(text(),'text:sgKR3U3i2Y')]`
    ).waitFor({state: 'visible'});
    expect(await countNotepads(page)).toEqual(25);
  }
});
