import type { Page } from '@playwright/test';

export const createNote = async (
  page: Page,
  content: string,
) => {
    // Set search text into search bar
    await page.locator(`xpath=//*[@id='id:create-note-textarea:ZtAZE54FsV']`).fill(content);
    // Click search button
    await page.locator(`xpath=//*[@id='id:create-note-button:j2OnOhuazV']`).click();
}

export const deleteNote = async (
  page: Page,
  content: string,
) => {
  // Click specific notepad options button
  await page.locator(
    'xpath=' +
    `//*[contains(text(),'${content}')]` +
    `//ancestor::div[contains(@class, 'class:text-note:7BoiMerq5D')]` +
    `//descendant::*[contains(@class, 'class:note-options-button:TMKI1oxDBJ')]`
  ).click();
  // Click delete option
  await page.locator(
    'xpath=' +
    `//*[contains(text(),'${content}')]` +
    `//ancestor::div[contains(@class, 'class:text-note:7BoiMerq5D')]` +
    `//descendant::*[contains(@class, 'class:note-options-delete-button:CEXEVxvbnV')]`
  ).click();
  // Click confirm button
  await page.locator(`xpath=//*[contains(@class, 'class:modal-confirm-button:fHIbu0jVfe')]`).click();
}

export const countNotes = async (
  page: Page,
) => {
  return await page.locator(
    `xpath=` +
    `//*[@id='id:notes-board:Y8FAln8HKV']` +
    `//descendant::*[contains(@class, 'class:text-note:7BoiMerq5D')]`
  ).count();
}