#!/usr/bin/env node

import { mkdir, readdir, rename, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const APP_URL = process.env.LAUNCHPROOF_URL || 'https://shanyuzhe.github.io/launchproof-mtp-2026/';
const OUTPUT = resolve(process.cwd(), 'launchproof-demo-video.webm');
const VIDEO_DIR = resolve(process.cwd(), '.demo-video');
const EDGE_EXECUTABLE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

main().catch((error) => {
  console.error('[fail] Demo video recording failed.');
  console.error(error);
  process.exit(1);
});

async function main() {
  await rm(VIDEO_DIR, { recursive: true, force: true });
  await mkdir(VIDEO_DIR, { recursive: true });

  const launchOptions = {
    headless: true,
  };

  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || existsSync(EDGE_EXECUTABLE)) {
    launchOptions.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || EDGE_EXECUTABLE;
  }

  const browser = await chromium.launch(launchOptions);
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1440, height: 960 },
    },
  });
  const page = await context.newPage();

  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await installCaptionOverlay(page);

  await caption(page, 'LaunchProof turns an AI-built prototype into a judge-ready launch packet.', 5000);
  await caption(page, 'First, load a realistic sample so the product is not only proving itself.', 4500);

  await page.getByRole('button', { name: /MeetingBridge/ }).click();
  await page.waitForTimeout(1500);
  await caption(page, 'MeetingBridge is an AI-built remote-team follow-up product with a different user and workflow.', 5000);

  await page.getByRole('textbox', { name: 'Success metric' }).fill(
    'A product lead exports a follow-up brief with decisions, owners, unresolved risks, and the next meeting agenda.',
  );
  await caption(page, 'We make one visible edit, then regenerate the packet from real input.', 4500);
  await page.getByRole('button', { name: 'Generate Launch Packet' }).click();
  await page.waitForTimeout(2500);

  await page.getByRole('button', { name: 'Run Judge Demo' }).click();
  await caption(page, 'Run Judge Demo walks through the proof path in one click.', 4000);

  for (let step = 2; step <= 6; step += 1) {
    await page.getByRole('button', { name: 'Next Proof Point' }).click();
    await caption(page, `Proof point ${step}/6: the story stays tied to product readiness.`, 3000);
  }

  await page.getByRole('button', { name: 'Flows', exact: true }).click();
  await caption(page, 'Flows turn the idea into critical user paths and acceptance checks.', 4500);

  await page.getByRole('button', { name: 'Risks', exact: true }).click();
  await caption(page, 'Risks make launch uncertainty explicit before shipping.', 4500);

  await page.getByRole('button', { name: 'Resilience', exact: true }).click();
  await caption(page, 'Resilience stress-tests the launch with pressure, recovery, proof, and no-ship conditions.', 5500);

  await page.getByRole('button', { name: 'Evidence', exact: true }).click();
  await caption(page, 'Evidence shows the scorecard, behavior coverage, and Novus/Pendo event map.', 6500);

  await page.getByRole('button', { name: 'Pitch', exact: true }).click();
  await caption(page, 'Pitch gives the builder a concise submission-ready story.', 4500);

  await page.getByRole('button', { name: 'Copy packet' }).click();
  await caption(page, 'Copy packet exports the launch story for Devpost or a real launch review.', 4500);

  await page.getByRole('button', { name: 'Evidence', exact: true }).click();
  await page.getByText('Behavior coverage').scrollIntoViewIfNeeded();
  await caption(page, 'Behavior coverage reaches 100 percent when the proof path has actually happened.', 6000);
  await caption(page, 'Shippedness is measurable: the public app emits Novus/Pendo behavior events.', 6000);
  await caption(page, 'AI helps you build faster. LaunchProof helps you prove it is ready to ship.', 6000);

  await context.close();
  await browser.close();

  const [recorded] = (await readdir(VIDEO_DIR)).filter((file) => file.endsWith('.webm'));
  if (!recorded) {
    throw new Error(`No .webm recording found in ${VIDEO_DIR}`);
  }

  await rm(OUTPUT, { force: true });
  await rename(join(VIDEO_DIR, recorded), OUTPUT);

  if (!existsSync(OUTPUT)) {
    throw new Error(`Expected output video does not exist: ${OUTPUT}`);
  }

  console.log(`[pass] Demo video written: ${OUTPUT}`);
}

async function installCaptionOverlay(page) {
  await page.addStyleTag({
    content: `
      #launchproof-video-caption {
        position: fixed;
        left: 48px;
        right: 48px;
        bottom: 36px;
        z-index: 999999;
        padding: 18px 22px;
        border-radius: 8px;
        background: rgba(15, 23, 42, 0.92);
        color: #fff;
        font: 700 28px/1.25 Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        box-shadow: 0 18px 60px rgba(15, 23, 42, 0.35);
        letter-spacing: 0;
      }
    `,
  });

  await page.evaluate(() => {
    const existing = document.getElementById('launchproof-video-caption');
    if (existing) {
      existing.remove();
    }
    const caption = document.createElement('div');
    caption.id = 'launchproof-video-caption';
    document.body.append(caption);
  });
}

async function caption(page, text, ms) {
  await page.evaluate((captionText) => {
    const caption = document.getElementById('launchproof-video-caption');
    if (!caption) {
      throw new Error('Caption overlay missing.');
    }
    caption.textContent = captionText;
  }, text);
  await page.waitForTimeout(ms);
}
