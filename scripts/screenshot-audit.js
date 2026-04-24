const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const APPS = [
  { app: "crypto", port: 3001, baseUrl: "http://localhost:3001" },
  { app: "intelligence", port: 3002, baseUrl: "http://localhost:3002" },
  { app: "onlinebiz", port: 3003, baseUrl: "http://localhost:3003" },
];

const VIEWPORTS = [
  { name: "375", width: 375, height: 800 },
  { name: "768", width: 768, height: 800 },
  { name: "1024", width: 1024, height: 800 },
  { name: "1920", width: 1920, height: 800 },
];

const PAGES = [
  { name: "home", path: "/" },
  { name: "articles", path: "/articles" },
  { name: "article", path: "/articles/example" },
];

const OUTPUT_BASE = path.resolve(__dirname, "../apps/ZYPERIA_SCREENSHOTS_v3");

async function takeScreenshot(page, app, viewport, pageDef, url) {
  const outputDir = path.join(OUTPUT_BASE, app);
  const filename = `${app}_${viewport.name}_${pageDef.name}.png`;
  const filepath = path.join(outputDir, filename);

  try {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    console.log(`  → ${viewport.name}px / ${pageDef.name} (${url})`);
    const response = await page.goto(url, { waitUntil: "networkidle" });

    if (response?.status?.() === 404 && pageDef.name === "article") {
      console.log(`    [404 on ${url}, using /articles instead]`);
      await page.goto(`${url.split("/articles")[0]}/articles`, {
        waitUntil: "networkidle",
      });
    }

    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`    ✓ Saved: ${filename}`);
  } catch (error) {
    console.error(`    ✗ Error on ${filename}: ${error.message}`);
  }
}

async function main() {
  let browser = null;

  try {
    console.log("🎬 ZYPERIA Screenshot Audit — Phase 2");
    console.log(`📁 Output: ${OUTPUT_BASE}`);
    console.log("━".repeat(60));

    for (const appConfig of APPS) {
      const dir = path.join(OUTPUT_BASE, appConfig.app);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    browser = await chromium.launch({
      headless: true,
      args: ["--disable-blink-features=AutomationControlled"],
    });

    for (const appConfig of APPS) {
      console.log(`\n📱 App: ${appConfig.app.toUpperCase()}`);
      const page = await browser.newPage();

      for (const viewport of VIEWPORTS) {
        console.log(`  📐 ${viewport.name}px`);

        for (const pageDef of PAGES) {
          const url = `${appConfig.baseUrl}${pageDef.path}`;
          await takeScreenshot(page, appConfig.app, viewport, pageDef, url);
        }
      }

      await page.close();
    }

    console.log("\n" + "━".repeat(60));
    console.log("✅ Screenshot audit complete!");
    console.log(`📊 Expected: 36 screenshots (3 apps × 4 viewports × 3 pages)`);
    console.log(`📂 Location: ${OUTPUT_BASE}`);
  } catch (error) {
    console.error("❌ Critical error:", error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

main();
