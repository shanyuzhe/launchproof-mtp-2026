#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const PORT = Number(process.env.LAUNCHPROOF_PORT || 3210);
const HOST = '127.0.0.1';
const APP_URL = process.env.LAUNCHPROOF_URL || `http://${HOST}:${PORT}/?sample=meetingbridge`;
const REPO_ROOT = process.cwd();
const NEXT_BIN = resolve(REPO_ROOT, 'node_modules/next/dist/bin/next');
const EDGE_EXECUTABLE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

main().catch((error) => {
  console.error('[fail] Local UI verification failed.');
  console.error(error);
  process.exit(1);
});

async function main() {
  let server;

  if (!process.env.LAUNCHPROOF_URL) {
    server = startNextServer();
    await waitForHttp(APP_URL);
  }

  const launchOptions = { headless: true };

  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || existsSync(EDGE_EXECUTABLE)) {
    launchOptions.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || EDGE_EXECUTABLE;
  }

  const browser = await chromium.launch(launchOptions);
  const origin = new URL(APP_URL).origin;

  try {
    await verifyDesktopFlow(browser, origin);
    await verifyMobileFlow(browser, origin);
  } finally {
    await browser.close();

    if (server) {
      server.kill();
    }
  }

  console.log(`[pass] Local UI verified and screenshots refreshed from ${APP_URL}`);
}

async function verifyDesktopFlow(browser, origin) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  await context.grantPermissions(['clipboard-write', 'clipboard-read'], { origin });
  const page = await context.newPage();

  try {
    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    await expectText(page, 'MeetingBridge');
    await expectText(page, 'Resilience');
    await assertNoDocumentHorizontalOverflow(page, 'desktop landing');
    await page.screenshot({ path: 'launchproof-main-workflow.png', fullPage: false });

    await page.getByRole('button', { name: 'Generate Launch Packet' }).click();
    await page.getByRole('button', { name: 'Resilience', exact: true }).click();
    await expectText(page, 'Resilience before shippedness');
    await expectText(page, 'Do not ship if');
    await assertNoDocumentHorizontalOverflow(page, 'desktop resilience');
    await page.screenshot({ path: 'launchproof-resilience-review.png', fullPage: false });

    await page.getByRole('button', { name: 'Run Judge Demo' }).click();

    for (let step = 2; step <= 6; step += 1) {
      await page.getByRole('button', { name: 'Next Proof Point' }).click();
    }

    await page.getByRole('button', { name: 'Copy packet' }).click();
    await page.getByRole('button', { name: 'Evidence', exact: true }).click();
    await expectText(page, 'Hackathon scorecard');
    await expectText(page, 'AI builder provenance');
    await expectText(page, 'Behavior coverage');
    await expectText(page, '7/7 proof behaviors completed this session');
    await assertNoDocumentHorizontalOverflow(page, 'desktop evidence');
    await page.screenshot({ path: 'launchproof-evidence-scorecard.png', fullPage: false });

    await page.getByText('Behavior coverage').scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'launchproof-behavior-coverage.png', fullPage: false });
    await page.screenshot({ path: 'launchproof-devpost-gallery.png', fullPage: true });
  } finally {
    await context.close();
  }
}

async function verifyMobileFlow(browser, origin) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await context.grantPermissions(['clipboard-write', 'clipboard-read'], { origin });
  const page = await context.newPage();

  try {
    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    await expectText(page, 'MeetingBridge');
    await expectText(page, '90-second judge path');
    await assertNoDocumentHorizontalOverflow(page, 'mobile landing');

    await page.getByRole('button', { name: 'Generate Launch Packet' }).click();
    await page.getByRole('button', { name: 'Resilience', exact: true }).click();
    await expectText(page, 'Resilience before shippedness');
    await expectText(page, 'Do not ship if');
    await assertNoDocumentHorizontalOverflow(page, 'mobile resilience');
    await page.screenshot({ path: 'launchproof-mobile-resilience.png', fullPage: true });

    await page.getByRole('button', { name: 'Evidence', exact: true }).click();
    await expectText(page, 'Hackathon scorecard');
    await expectText(page, 'AI builder provenance');
    await expectText(page, 'Behavior coverage');
    await assertNoDocumentHorizontalOverflow(page, 'mobile evidence');
  } finally {
    await context.close();
  }
}

function startNextServer() {
  if (!existsSync(NEXT_BIN)) {
    throw new Error(`Next.js binary not found: ${NEXT_BIN}`);
  }

  const child = spawn(process.execPath, [NEXT_BIN, 'dev', '--port', String(PORT), '--hostname', HOST], {
    cwd: REPO_ROOT,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (chunk) => process.stdout.write(`[next] ${chunk}`));
  child.stderr.on('data', (chunk) => process.stderr.write(`[next] ${chunk}`));
  child.on('exit', (code, signal) => {
    if (code !== null && code !== 0) {
      console.error(`[fail] Next dev server exited with code ${code}`);
    } else if (signal) {
      console.warn(`[warn] Next dev server exited from signal ${signal}`);
    }
  });

  return child;
}

async function waitForHttp(url) {
  let lastError;

  for (let attempt = 1; attempt <= 40; attempt += 1) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return;
      }

      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for ${url}: ${lastError?.message}`);
}

async function expectText(page, text) {
  const locator = page.getByText(text).first();
  await locator.waitFor({ state: 'visible', timeout: 10000 });
}

async function assertNoDocumentHorizontalOverflow(page, label) {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));

  if (overflow.scrollWidth > overflow.viewportWidth + 2) {
    throw new Error(
      `${label} has page-level horizontal overflow: ${overflow.scrollWidth}px document vs ${overflow.viewportWidth}px viewport`,
    );
  }
}
