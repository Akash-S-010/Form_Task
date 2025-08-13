// scraper.js
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

puppeteer.use(StealthPlugin());

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: 60000,
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    page.on('error', err => console.error('Page error:', err));
    page.on('pageerror', err => console.error('Page script error:', err));

    await page.goto('https://udyamregistration.gov.in/UdyamRegistration.aspx', { waitUntil: 'networkidle2', timeout: 60000 });
    await page.screenshot({ path: 'udyam-page.png' });

    // Extract Step 1 fields
    const step1Fields = await page.evaluate(() => {
      const fields = [];
      const form = document.querySelector('form');
      if (!form) return fields;
      const elements = form.querySelectorAll('input, select, button');
      elements.forEach(el => {
        if (el.type === 'hidden') return; // Skip hidden fields
        let label = '';
        if (el.id || el.name) {
          const labelEl = form.querySelector(`label[for="${el.id || el.name}"]`) || 
                         Array.from(form.querySelectorAll('label')).find(l => l.textContent.includes(el.name));
          label = labelEl?.textContent.trim() || el.placeholder || el.name;
        }
        if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
          fields.push({
            type: el.tagName.toLowerCase(),
            id: el.id || '',
            name: el.name || '',
            label,
            placeholder: el.placeholder || '',
            required: el.required || false,
            pattern: el.pattern || (el.name.includes('adhar') ? '\\d{12}' : el.name.includes('otp') ? '\\d{6}' : ''),
            typeAttr: el.type || '',
          });
        } else if (el.tagName === 'BUTTON' || (el.tagName === 'INPUT' && el.type === 'submit')) {
          fields.push({
            type: 'button',
            id: el.id || '',
            text: el.textContent.trim() || el.value.trim(),
          });
        }
      });
      return fields;
    });

    // Simulate Aadhaar entry
    const aadhaarSelector = '#ctl00_ContentPlaceHolder1_txtadharno';
    const nameSelector = '#ctl00_ContentPlaceHolder1_txtownername';
    const checkboxSelector = '#ctl00_ContentPlaceHolder1_chkDecarationA';
    const validateBtnSelector = '#ctl00_ContentPlaceHolder1_btnValidateAadhaar';

    await page.waitForSelector(aadhaarSelector, { timeout: 15000 });
    await page.type(aadhaarSelector, '123456789012', { delay: 100 });
    await page.type(nameSelector, 'Test Name', { delay: 100 });
    await page.click(checkboxSelector);
    const navigationPromise = page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
    await page.click(validateBtnSelector);
    await navigationPromise;

    // Extract OTP fields
    const otpSelector = '#ctl00_ContentPlaceHolder1_txtAadhaarOTP';
    let otpFields = await page.evaluate((otpSelector) => {
      const fields = [];
      const otpInput = document.querySelector(otpSelector);
      if (otpInput) {
        const labelEl = document.querySelector(`label[for="${otpInput.id}"]`) || 
                       Array.from(document.querySelectorAll('label')).find(l => l.textContent.includes('OTP'));
        fields.push({
          type: 'input',
          id: otpInput.id,
          name: otpInput.name || 'otp',
          label: labelEl?.textContent.trim() || 'OTP',
          placeholder: otpInput.placeholder || 'Enter 6-digit OTP',
          required: true,
          pattern: '\\d{6}',
          typeAttr: otpInput.type || 'text',
        });
      }
      const btn = document.querySelector('#ctl00_ContentPlaceHolder1_btnAadhaarOTPValidate');
      if (btn) {
        fields.push({
          type: 'button',
          id: btn.id,
          text: btn.textContent.trim() || 'Validate OTP',
        });
      }
      return fields;
    }, otpSelector);

    // Simulate OTP entry
    let panFields = [];
    await page.type(otpSelector, '123456', { delay: 100 });
    const otpValidateBtn = '#ctl00_ContentPlaceHolder1_btnAadhaarOTPValidate';
    const navigationPromise2 = page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
    await page.click(otpValidateBtn);
    await navigationPromise2;

    // Extract PAN fields
    const panSelector = '#ctl00_ContentPlaceHolder1_txtPANNo';
    panFields = await page.evaluate((panSelector) => {
      const fields = [];
      const panInput = document.querySelector(panSelector);
      if (panInput) {
        const labelEl = document.querySelector(`label[for="${panInput.id}"]`) || 
                       Array.from(document.querySelectorAll('label')).find(l => l.textContent.includes('PAN'));
        fields.push({
          type: 'input',
          id: panInput.id,
          name: panInput.name || 'pan',
          label: labelEl?.textContent.trim() || 'PAN Number',
          placeholder: panInput.placeholder || 'Enter PAN (e.g., ABCDE1234F)',
          required: true,
          pattern: '[A-Z]{5}\\d{4}[A-Z]{1}',
          typeAttr: panInput.type || 'text',
        });
      }
      const btn = document.querySelector('#ctl00_ContentPlaceHolder1_btnPANValidate');
      if (btn) {
        fields.push({
          type: 'button',
          id: btn.id,
          text: btn.textContent.trim() || 'Validate PAN',
        });
      }
      return fields;
    }, panSelector);

    const scrapedData = {
      step1: step1Fields.concat(otpFields),
      step2: panFields,
    };

    fs.writeFileSync('scraped-schema.json', JSON.stringify(scrapedData, null, 2));
    console.log('Scraped data saved to scraped-schema.json');
  } catch (e) {
    console.error('Scraper error:', e.message);
    if (browser) await browser.screenshot({ path: 'error.png' });
  } finally {
    if (browser) await browser.close().catch(err => console.error('Browser close error:', err));
  }
})();