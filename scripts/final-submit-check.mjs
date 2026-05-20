#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const APP_URL = 'https://shanyuzhe.github.io/launchproof-mtp-2026/';
const SCREENSHOT = 'novus-pendo-dashboard.png';
const ALLOWED_VIDEO_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'vimeo.com',
  'www.vimeo.com',
  'youku.com',
  'www.youku.com',
];

main();

function main() {
  const videoUrl = process.argv[2] || process.env.DEMO_VIDEO_URL;

  if (!videoUrl) {
    fail('Missing demo video URL. Usage: node scripts/final-submit-check.mjs https://...');
  }

  if (!/^https?:\/\/\S+\.\S+/.test(videoUrl)) {
    fail(`Demo video URL must be a public http(s) URL: ${videoUrl}`);
  }

  if (!isAllowedDemoVideoHost(videoUrl)) {
    fail(`Demo video URL must be hosted on YouTube, Vimeo, or Youku: ${videoUrl}`);
  }

  if (!existsSync(resolve(process.cwd(), SCREENSHOT))) {
    fail(`Missing required Novus/Pendo screenshot: ${SCREENSHOT}`);
  }

  const args = [
    'run',
    'verify:launchproof',
    '--',
    '--url',
    APP_URL,
    '--dashboard-screenshot',
    SCREENSHOT,
    '--demo-video-url',
    videoUrl,
  ];

  const child = spawn('npm.cmd', args, {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: false,
  });

  child.on('exit', (code) => {
    process.exit(code ?? 1);
  });
}

function fail(message) {
  console.error(`[fail] ${message}`);
  process.exit(1);
}

function isAllowedDemoVideoHost(value) {
  try {
    const hostname = new URL(value).hostname.toLowerCase();
    return ALLOWED_VIDEO_HOSTS.includes(hostname);
  } catch (error) {
    console.error(error);
    return false;
  }
}
