import type { Page } from '@playwright/test';

export const createPage = async (
  page: Page,
  notepadName: string,
  name: string,
) => {
  // Click specific notepad options button
  await page.locator(
    'xpath=' +
    `//*[contains(text(), '${notepadName}')]` + // Notepad text element
    `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]` + // Notepad element
    `//descendant::*[contains(@class, 'class:notepad-options-button:GrWzrbooC9')]` // Options button
  ).click();
  // Click create page option
  await page.locator(
    'xpath=' +
    `//*[contains(text(), '${notepadName}')]` + // Notepad text element
    `//ancestor::div[contains(@class, 'class:notepad:8iwbWkd5Y1')]` + // Notepad element
    `//descendant::*[contains(@class, 'class:notepad-options-create-page-button:LLAk9dX9bP')]` // Create Page button
  ).click();
  await page.locator(
    'xpath=' +
    `//div[contains(@class, 'class:page-modal-name-input-wrapper:o0Tmq3A18Z')]` +
    `//descendant::input`
  ).fill(name);
  // Click confirm button
  await page.locator(`xpath=//*[contains(@class, 'class:modal-confirm-button:fHIbu0jVfe')]`).click();
}

export const updatePage = async (
  page: Page,
  name: string,
  newName: string,
) => {
  // Click specific notepad options button
  await page.locator(
    'xpath=' +
    `//*[contains(text(), '${name}')]` +
    `//ancestor::*[contains(@class, 'class:page:8o3bzP8yoT')]` +
    `//descendant::*[contains(@class, 'class:page-options-button:WvlSIUCzRC')]`
  ).click();
  // Click edit page option
  await page.locator(
    'xpath=' +
    `//*[contains(text(), '${name}')]` +
    `//ancestor::*[contains(@class, 'class:page:8o3bzP8yoT')]` +
    `//descendant::*[contains(@class, 'class:page-options-edit-button:1bWdLl8T87')]`
  ).click();
  await page.locator(
    'xpath=' +
    `//div[contains(@class, \'class:page-modal-name-input-wrapper:o0Tmq3A18Z\')]` +
    `//descendant::input`
  ).fill(newName);
  // Click confirm button
  await page.locator(`xpath=//*[contains(@class, 'class:modal-confirm-button:fHIbu0jVfe')]`).click();
}

export const deletePage = async (
  page: Page,
  name: string,
) => {
  // Click specific notepad options button
  await page.locator(
    'xpath=' +
    `//*[contains(text(), '${name}')]` +
    `//ancestor::*[contains(@class, 'class:page:8o3bzP8yoT')]` +
    `//descendant::*[contains(@class, 'class:page-options-button:WvlSIUCzRC')]`
  ).click();
  // Click delete page option
  await page.locator(
    `//*[contains(text(), '${name}')]` +
    `//ancestor::*[contains(@class, 'class:page:8o3bzP8yoT')]` +
    `//descendant::*[contains(@class, 'class:page-options-delete-button:excgDO3li2')]`
  ).click();
  // Click confirm button
  await page.locator(`xpath=//*[contains(@class, 'class:modal-confirm-button:fHIbu0jVfe')]`).click();
}

export const countPages = async (
  page: Page,
) => {
  return await page.locator(
    `xpath=` +
    `//*[@id='id:notepad-list-container:7MLMomsYBt']` +
    `//descendant::*[contains(@class, 'class:page:8o3bzP8yoT')]`
  ).count();
}
