import { chromium } from "playwright";

const NEW_NAME = "stress-test-dashboard";

const browser = await chromium.launch({ channel: "chrome", headless: false });
const ctx = await browser.newContext();
const page = await ctx.newPage();

// Go to login page
await page.goto("https://app.netlify.com/login");
console.log("Log in to Netlify in the browser window. Script waits until you're in...");

// Wait until redirected to dashboard after login (up to 3 min)
await page.waitForURL(/app\.netlify\.com\/(?!login)/, { timeout: 180_000 });
console.log("Logged in. Navigating to site settings...");

// Go directly to the site's general settings
await page.goto(
  "https://app.netlify.com/sites/lighthearted-sunburst-1a4552/configuration/general",
);
await page.waitForLoadState("networkidle");

// Click the "Change site name" button
const changeBtn = page.getByRole("button", { name: /change site name/i });
await changeBtn.waitFor({ timeout: 15_000 });
await changeBtn.click();

// Modal opens — fill the name input
const nameInput = page.locator('input[name="name"], input[id*="name"]').first();
await nameInput.waitFor({ timeout: 10_000 });
await nameInput.fill(NEW_NAME);

// Click Save / Confirm
const saveBtn = page.getByRole("button", { name: /save|confirm|update/i }).last();
await saveBtn.click();

await page.waitForTimeout(3000);
console.log(`\n✅ Done — new URL: https://${NEW_NAME}.netlify.app`);

await browser.close();
