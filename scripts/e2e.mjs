#!/usr/bin/env node
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = 8097;
const BASE = `http://localhost:${PORT}/`;
function fail(m) { console.error(`✖ ${m}`); process.exit(1); }
async function waitForServer(url, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try { const r = await fetch(url); if (r.ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 300));
  }
  fail(`server not ready: ${url}`);
}

const vite = spawn("npm", ["run", "dev"], { cwd: new URL("..", import.meta.url).pathname, stdio: "ignore", detached: true });

try {
  await waitForServer(BASE);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e?.message || e)));

  await page.goto(`${BASE}?practice=demo`, { waitUntil: "domcontentloaded" });
  await page.getByText("Practice · ml-gd · ml-gd-10").waitFor({ timeout: 15_000 });
  console.log("✔ demo payload rendered into the header");

  for (let i = 0; i < 3; i += 1) {
    const options = page.locator(".stack .btn");
    await options.first().waitFor({ timeout: 10_000 });
    await options.first().click();
    await page.waitForTimeout(2200);
  }
  const complete = page.getByRole("button", { name: "Complete" });
  if (!(await complete.isEnabled())) fail("Complete did not enable after the deck");
  console.log("✔ deck finished — Complete unlocked");

  await page.getByRole("button", { name: "Locked" }).click();
  await complete.click();
  await page.getByText("Result for DAU").waitFor({ timeout: 5_000 });
  const result = JSON.parse(await page.locator("pre.result").innerText());
  if (result.sourceApp !== "ml-lab") fail(`unexpected result ${JSON.stringify(result)}`);
  console.log("✔ result panel:", JSON.stringify(result).slice(0, 100));

  if (errors.length > 0) console.warn("⚠ page errors:", errors);
  await browser.close();
  console.log("\n✅ E2E OK");
} finally {
  try { process.kill(-vite.pid); } catch {}
}
