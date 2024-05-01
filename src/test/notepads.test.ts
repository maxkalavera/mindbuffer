import {describe, expect, test} from '@jest/globals';
import webdriver, { By, Key, until } from 'selenium-webdriver'

const driverRef: {current: webdriver.ThenableWebDriver} = {current: undefined}

const createNotepad = async (
  driver: webdriver.ThenableWebDriver,
  name: string,
) => {
  const createButton = await driver.findElement(By.id('id:20bee6661ebb48bcb7109bbebdf6e59c'))
  await createButton.click()
  const nameInput = await driver.findElement(
    By.xpath('//div[contains(@class, \'class:4fa38b49d2d34cef90ad4374cde805ab\')]//descendant::input'))
  await nameInput.sendKeys(name)
  const confirmButton = await driver.findElement(By.className('class:6012f7869d934c888ac9711da2eb0db7'))
  await confirmButton.click()
}

const updateNotepad = async (
  driver: webdriver.ThenableWebDriver,
  name: string,
  newName: string,
) => {
  const optionsButton = await driver.findElement(By.xpath([
    `//*[contains(text(), '${name}')]`,
    `//ancestor::div[contains(@class, 'class:f07d35d05aba4e189e8d90bdfa30f2b0')]`,
    `//descendant::*[contains(@class, 'class:1111038c21384acd8519b8b0de8ee56f')]`
  ].join('')))
  await optionsButton.click()
  const editButton = await driver.findElement(By.xpath([
    `//*[contains(text(), '${name}')]`,
    `//ancestor::div[contains(@class, 'class:f07d35d05aba4e189e8d90bdfa30f2b0')]`,
    `//descendant::*[contains(@class, 'class:6fa0c084fc5747cf9c9ae554788c5c14')]`
  ].join('')))
  await editButton.click()
  const nameInput = await driver.findElement(
    By.xpath('//div[contains(@class, \'class:4fa38b49d2d34cef90ad4374cde805ab\')]//descendant::input'))
  await nameInput.clear()
  await nameInput.sendKeys(newName)
  const confirmButton = await driver.findElement(By.className('class:6012f7869d934c888ac9711da2eb0db7'))
  await confirmButton.click()
}

const deleteNotepad = async (
  driver: webdriver.ThenableWebDriver,
  name: string,
) => {
  const optionsButton = await driver.findElement(By.xpath([
    `//*[contains(text(), '${name}')]`,
    `//ancestor::div[contains(@class, 'class:f07d35d05aba4e189e8d90bdfa30f2b0')]`,
    `//descendant::*[contains(@class, 'class:1111038c21384acd8519b8b0de8ee56f')]`
  ].join('')))
  await optionsButton.click()
  const deleteButton = await driver.findElement(By.xpath([
    `//*[contains(text(), '${name}')]`,
    `//ancestor::div[contains(@class, 'class:f07d35d05aba4e189e8d90bdfa30f2b0')]`,
    `//descendant::*[contains(@class, 'class:dcf43c19345a4a4590b5a5b971e2d439')]`
  ].join('')))
  await deleteButton.click()
  const confirmButton = await driver.findElement(By.className('class:6012f7869d934c888ac9711da2eb0db7'))
  await confirmButton.click()
}

const countNotepads = async (
  driver:  webdriver.ThenableWebDriver,
) => {
  return (await driver.findElements(
    By.xpath(`//*[@id='id:e7d6b885ff794c278ee07af4cfd1427c']//descendant::*[contains(@class, 'class:f07d35d05aba4e189e8d90bdfa30f2b0')]`)
  )).length
}

describe('Notes operations', () => {
  beforeEach(() => {
    driverRef.current = new webdriver.Builder()
      .usingServer('http://localhost:9515')
      .withCapabilities({
        'goog:chromeOptions': {
          binary: global.__BINARY_PATH__
        }
      })
      .forBrowser('chrome')
      .build()
  });
  afterEach(async () => {
    await driverRef.current.quit()
  });
  test.skip('Notepad is added it\'s container when created', async () => {
    const driver = driverRef.current
    const name = 'text:a092c54dd32b40519a3951a3ef5daec1'
    await createNotepad(driver, name)
    expect(await driver.findElements(
      By.xpath(`//*[contains(text(),'${name}')]//ancestor::div[contains(@class, 'class:f07d35d05aba4e189e8d90bdfa30f2b0')]`)
    )).toHaveLength(1)
  })
  test.skip('Notepad is modified from it\'s container when updated', async () => {
    const driver = driverRef.current
    const originalName = 'text:e1682199a41f4febb6b07eba66278f65'
    const updatedName = 'text:41760934a93143f0a6cab4aa9c483b28'
    await createNotepad(driver, originalName)
    expect(await driver.findElements(
      By.xpath(`//*[contains(text(),'${originalName}')]//ancestor::div[contains(@class, 'class:f07d35d05aba4e189e8d90bdfa30f2b0')]`)
    )).toHaveLength(1)
    await updateNotepad(driver, originalName, updatedName)
    expect(await driver.findElements(
      By.xpath(`//*[contains(text(),'${originalName}')]//ancestor::div[contains(@class, 'class:f07d35d05aba4e189e8d90bdfa30f2b0')]`)
    )).toHaveLength(0)
    expect(await driver.findElements(
      By.xpath(`//*[contains(text(),'${updatedName}')]//ancestor::div[contains(@class, 'class:f07d35d05aba4e189e8d90bdfa30f2b0')]`)
    )).toHaveLength(1)
  })
  test.skip('Notepad is removed from it\'s container when deleted', async () => {
    const driver = driverRef.current
    const name = 'text:08e48f97a9a045e59a446990551c844a'
    await createNotepad(driver, name)
    expect(await driver.findElements(
      By.xpath(`//*[contains(text(),'${name}')]//ancestor::div[contains(@class, 'class:f07d35d05aba4e189e8d90bdfa30f2b0')]`)
    )).toHaveLength(1)
    await deleteNotepad(driver, name)
    expect(await driver.findElements(
      By.xpath(`//*[contains(text(),'${name}')]//ancestor::div[contains(@class, 'class:f07d35d05aba4e189e8d90bdfa30f2b0')]`)
    )).toHaveLength(0)
  })
  test.skip('Notepad container should paginate when there is too many items', async () => {
    const notepads = [
      'text:c63fd288c6704609b2e985576de02993',
      'text:2b6d7968c27c44abb56285c79e91f2b5',
      'text:5bea5ebce5884c5aa4c5eb91842264b1',
      'text:5b2a50e0a2b443abac7f7ed47acf72fe',
      'text:32b87edfd26246d0abb8441269a63bde',
      'text:8fa871256d924b6e97a4cfccda12fc3a',
      'text:81341af06e7141ba8b784f9c6d574912',
      'text:1f03d79b93b544aaa171f8008b1bcbc5',
      'text:f93ef934290742a5a57f521a1af837ef',
      'text:5439a158e5cf45d19ddd64c8ed4ad6c1',
      'text:9721fbb4a17747338da74139fa4e2a02',
      'text:db3d0b86e4f748fabe3b6cdf59b0b326',
      'text:7d38a0c32e76436ba1a8a9e509d37845',
      'text:db6bf350d0f94088b2d6c2951f7597fe',
      'text:afd24f4065334e8098713509568045f2',
      'text:5e543295aeb24341881f0d8ec9ec089f',
      'text:2968bd3d72bd47548cedbfb88e28369f',
      'text:101cb580a02949808a9be23bd0c2ecc5',
      'text:0a6f9d913c2a4edf823c7ff3f8279a0b',
      'text:6f84107d14f14779bd191225c5e02759',
      'text:b1c3e49b0d374aab8acc90eb4736d201',
      'text:24c9a9bac51d49b3a3801045ce2e05f3',
      'text:c8e5cf434f614e5c815cacd15ccf63f2',
      'text:337401eb4c9a45b8bd132bd88cc67f28',
      'text:78583d7254b646208b07c92d1c734e81',
    ]
    const driver = driverRef.current
    for(let i = 0; i < notepads.length; i++) {
      await createNotepad(driver, notepads[i])
    }
    await driver.navigate().refresh()
    expect(await countNotepads(driver)).toEqual(20)
    await driver.executeScript(`
      const notepadContainer = document.getElementById('id:e7d6b885ff794c278ee07af4cfd1427c');
      notepadContainer.scrollTo(0, notepadContainer.scrollHeight);
    `)
    await driver.wait(until.elementsLocated(
      By.xpath(`//*[@id='id:e7d6b885ff794c278ee07af4cfd1427c']//descendant::*[contains(text(),'${notepads[notepads.length - 1]}')]`)
    ))
    expect(await countNotepads(driver)).toEqual(25)
  })
})