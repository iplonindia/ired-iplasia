const puppeteer = require('puppeteer');

(async () => {
  // Get the username, password, and URL from command line arguments
  const url = process.argv[2];
  const username = process.argv[3];
  const password = process.argv[4];


  // Set up the browser
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  // Navigate to the Grafana login page
  //await page.goto(`${url}/login`);
  await page.goto(url, { waitUntil: 'networkidle0' });

  // Wait for the login page to load and enter the credentials
  await page.waitForSelector('input[name="user"]');
  await page.type('input[name="user"]', username);
  await page.type('input[name="password"]', password);

  // Click the login button and wait for the dashboard page to load
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0' })
  ]);

  // Wait for the dropdown options to appear
  await page.waitForSelector('header.panel-title-container');

  // Click the dropdown menu to open it
  await page.click('header.panel-title-container');

  // Find the data button in the inspect menu and click it
  await page.waitForXPath('//a[./span[text()="Inspect"]]');
  const dataButton = (await page.$x('//a[./span[text()="Inspect"]]'))[0];
  await dataButton.click();

  // Find Data options and click it
  
  await page.waitForSelector('button.css-1i6bacp');
  await page.evaluate(() => {
  const dropdown = document.querySelector('button.css-1i6bacp');
  dropdown.click();
  });

  //await page.waitForSelector('button.css-1i6bacp');
  //await page.click('button.css-1i6bacp');
  //await page.waitForXPath('//div[text()="Data options"]');
  //const data = (await page.$x('//div[text()="Data options"]'))[0];
  //await data.click();
  //await page.waitForSelector('div.css-k8f47l'); // wait for the tab to appear
  //await page.evaluate(() => {
  //const dataOptionsTab = document.querySelector('//div[text()="Data options"]');
  //const dataOptionsTab = await page.$('.css-13se522'); // using class selector
  //await dataOptionsTab.click();
  //});
  
  //async function clickDataOptionsTab() {
  //const dataOptionsTab = await page.$('div.css-13se522'); // using class selector
  //await dataOptionsTab.click();
  //}

  //await clickDataOptionsTab();



  // Find show data frame and click it inside
  await page.waitForSelector('div.css-15fuo2f-input-wrapper.css-imcr96');
  await page.click('div.css-15fuo2f-input-wrapper.css-imcr96');

  // Find the series joined by time option and click it
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Enter');

  // Find the download CSV button in the data options menu and click it
  await page.waitForSelector('button.css-1vp08vr-button');
  await page.click('button.css-1vp08vr-button');

  await page.waitForTimeout(5000);

  // Close the browser
  await browser.close();
})();

