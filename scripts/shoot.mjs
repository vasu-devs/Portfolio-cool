// Dev-only: capture section screenshots for visual verification.
import puppeteer from 'puppeteer-core';

const OUT = process.env.SHOT_DIR || 'C:/Users/VASUDE~1/AppData/Local/Temp/shots';
const URL = process.env.SHOT_URL || 'http://localhost:5173/';

const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 2500));

const sections = ['hero', 'experience', 'projects', 'more-projects', 'skills', 'open-source', 'services', 'contact'];
for (const id of sections) {
    await page.evaluate((sectionId) => {
        const el = document.getElementById(sectionId);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 24, behavior: 'instant' });
    }, id);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: `${OUT}/v2-${id}.png` });
}
await browser.close();
console.log('done');
