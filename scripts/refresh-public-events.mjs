#!/usr/bin/env node

import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const PUBLIC_SAMPLE_URL =
  process.env.LAUNCHPROOF_PUBLIC_EVENT_URL ||
  'https://shanyuzhe.github.io/launchproof-mtp-2026/?sample=meetingbridge';
const OUTPUT_PATH = resolve(
  process.cwd(),
  process.env.LAUNCHPROOF_EVENT_REFRESH_OUTPUT || 'mind-the-product-2026/latest-public-event-refresh.json',
);
const EDGE_EXECUTABLE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const FLUSH_WAIT_MS = Number(process.env.LAUNCHPROOF_EVENT_FLUSH_MS || 35000);

main().catch((error) => {
  console.error('[fail] Public event refresh failed.');
  console.error(error);
  process.exit(1);
});

async function main() {
  const runId = `refresh-${Date.now()}`;
  const appUrl = withRunId(PUBLIC_SAMPLE_URL, runId);
  const pendoRequests = [];
  const pendoResponses = [];
  const launchOptions = { headless: true };

  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE) {
    launchOptions.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
  } else if (await canUseEdge()) {
    launchOptions.executablePath = EDGE_EXECUTABLE;
  }

  console.log(`[check] Opening public app: ${appUrl}`);
  const browser = await chromium.launch(launchOptions);
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: new URL(appUrl).origin });
  const page = await context.newPage();

  page.on('request', (request) => {
    const url = request.url();

    if (url.includes('pendo.io')) {
      pendoRequests.push({
        method: request.method(),
        resourceType: request.resourceType(),
        url: sanitizeUrl(url),
      });
    }
  });

  page.on('response', (response) => {
    const url = response.url();

    if (url.includes('pendo.io')) {
      pendoResponses.push({
        status: response.status(),
        url: sanitizeUrl(url),
      });
    }
  });

  try {
    await page.goto(appUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await expectText(page, 'MeetingBridge');
    await waitForAnalyticsStatus(page);

    await page.getByLabel('Success metric').fill(
      `A product lead exports a follow-up brief with decisions, owners, unresolved risks, and the next meeting agenda. Event refresh ${runId}.`,
    );
    await page.getByRole('button', { name: 'Generate Launch Packet' }).click();
    await page.getByRole('button', { name: 'Run Judge Demo' }).click();

    for (let step = 2; step <= 6; step += 1) {
      await page.getByRole('button', { name: 'Next Proof Point' }).click();
    }

    for (const tabName of ['Flows', 'Risks', 'Resilience', 'Evidence', 'Pitch']) {
      await page.getByRole('button', { name: tabName, exact: true }).click();
      await delay(350);
    }

    await page.getByRole('button', { name: 'Copy packet' }).click();
    await page.getByRole('button', { name: 'Evidence', exact: true }).click();
    await expectText(page, '7/7 proof behaviors completed this session');

    console.log(`[check] Waiting ${(FLUSH_WAIT_MS / 1000).toFixed(0)}s for Pendo/Novus event flush`);
    await delay(FLUSH_WAIT_MS);

    const pageEvidence = await collectPageEvidence(page);
    const pendoScriptLoaded = pendoResponses.some(
      (response) => response.url.includes('cdn.pendo.io/agent/static') && isSuccessStatus(response.status),
    );
    const pendoDataAccepted = pendoResponses.some(
      (response) => response.url.includes('data.pendo.io/data/rec') && isSuccessStatus(response.status),
    );
    const result = {
      appUrl,
      checkedAt: new Date().toISOString(),
      passed: pendoScriptLoaded && pendoDataAccepted && pageEvidence.coverageText.includes('7/7'),
      pageEvidence,
      pendo: {
        scriptLoaded: pendoScriptLoaded,
        dataAccepted: pendoDataAccepted,
        requestCount: pendoRequests.length,
        responseCount: pendoResponses.length,
        requests: pendoRequests.slice(-20),
        responses: pendoResponses.slice(-20),
      },
      runId,
    };

    writeJson(OUTPUT_PATH, result);
    console.log(`[check] Wrote event refresh evidence: ${OUTPUT_PATH}`);

    if (!pendoScriptLoaded) {
      throw new Error('[fail] Pendo CDN script was not observed with a successful response.');
    }

    if (!pendoDataAccepted) {
      throw new Error('[fail] Pendo data endpoint was not observed with a successful response.');
    }

    if (!pageEvidence.coverageText.includes('7/7')) {
      throw new Error(`[fail] Behavior coverage did not reach 7/7: ${pageEvidence.coverageText}`);
    }

    console.log('[pass] Public LaunchProof events refreshed and Pendo data endpoint accepted requests.');
  } finally {
    await browser.close();
  }
}

async function canUseEdge() {
  try {
    const { existsSync } = await import('node:fs');
    return existsSync(EDGE_EXECUTABLE);
  } catch (error) {
    console.error('[fail] Could not inspect Edge executable path.');
    console.error(error);
    return false;
  }
}

function withRunId(url, runId) {
  const parsed = new URL(url);
  parsed.searchParams.set('eventRefresh', runId);
  return parsed.toString();
}

async function waitForAnalyticsStatus(page) {
  await page.waitForFunction(
    () => typeof window.launchproofAnalyticsStatus === 'string' && window.launchproofAnalyticsStatus.length > 0,
    { timeout: 20000 },
  );
}

async function expectText(page, text) {
  await page.getByText(text).first().waitFor({ state: 'visible', timeout: 15000 });
}

async function collectPageEvidence(page) {
  return page.evaluate(() => {
    const textOf = (selector) => document.querySelector(selector)?.textContent?.trim() || '';
    const localEvents = Array.from(document.querySelectorAll('.event-feed div:not(.row-title) span'))
      .map((element) => element.textContent?.trim())
      .filter(Boolean);

    return {
      analyticsStatus: window.launchproofAnalyticsStatus || '',
      coverageText: textOf('.coverage-meter span'),
      hasPendo: Boolean(window.pendo),
      hasNovusAlias: Boolean(window.novus),
      localEvents,
      title: document.title,
      url: window.location.href,
    };
  });
}

function isSuccessStatus(status) {
  return status >= 200 && status < 400;
}

function sanitizeUrl(value) {
  const url = new URL(value);
  return `${url.origin}${url.pathname}`;
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}
