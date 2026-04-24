const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });

  const urls = [
    { name: 'crypto', port: 3001 },
    { name: 'intelligence', port: 3002 },
    { name: 'onlinebiz', port: 3003 }
  ];

  for (const { name, port } of urls) {
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });

      const url = `http://localhost:${port}`;
      console.log(`Capturing ${name} at ${url}...`);

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      const outputPath = path.join(__dirname, 'apps', 'ZYPERIA_SCREENSHOTS', `${name}.png`);
      await page.screenshot({ path: outputPath, fullPage: true });

      console.log(`✓ Saved: ${outputPath}`);
      await page.close();
    } catch (error) {
      console.error(`✗ Failed for ${name}:`, error.message);
    }
  }

  await browser.close();
  console.log('\nScreenshots complete.');
})();
