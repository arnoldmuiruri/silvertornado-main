import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "dist/deploy.zip");

const browser = await chromium.launch({
  channel: "chrome",   // use system Chrome — no download needed
  headless: false,
});

const ctx = await browser.newContext();
const page = await ctx.newPage();

console.log("Opening Netlify — log in if prompted, then the script will handle the upload.");
await page.goto("https://app.netlify.com/drop");

// Wait for user to log in if needed — poll until drop zone is visible
console.log("Waiting for Netlify drop zone (up to 120s for login)...");
await page.waitForSelector('[data-testid="dropzone"], .dropzone, input[type="file"]', {
  timeout: 120_000,
});

// Netlify drop page has a hidden <input type="file" webkitdirectory>
// We can set files on it directly via Playwright
const input = page.locator('input[type="file"]').first();

await input.setInputFiles(DIST);

console.log("Files set — waiting for upload to complete...");

// Wait for the deploy URL to appear (Netlify shows it after upload)
await page.waitForSelector('a[href*=".netlify.app"], [data-testid="deploy-url"]', {
  timeout: 300_000,
});

const deployUrl = await page
  .locator('a[href*=".netlify.app"]')
  .first()
  .getAttribute("href");

console.log("\n✅ Deploy complete:", deployUrl);

await browser.close();
