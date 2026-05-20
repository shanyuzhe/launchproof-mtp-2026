#!/usr/bin/env node

import { copyFileSync, existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, join, resolve } from 'node:path';

const OUTPUT = 'novus-pendo-dashboard.png';
const MIN_WIDTH = 600;
const MIN_HEIGHT = 350;
const DAY_MS = 24 * 60 * 60 * 1000;
const SEARCH_DIRS = [
  process.cwd(),
  join(homedir(), 'Downloads'),
  join(homedir(), 'Desktop'),
  join(homedir(), 'Pictures'),
  join(homedir(), 'OneDrive', 'Pictures'),
  join(homedir(), 'OneDrive', 'Desktop'),
];

main();

function main() {
  const explicitPath = process.argv[2];
  const source = explicitPath ? resolve(explicitPath) : findBestScreenshot();

  if (!source) {
    fail(
      'No suitable Novus/Pendo screenshot found. Save or rename a normal-size PNG/JPEG with novus, pendo, or dashboard in the filename, or pass the image path explicitly.',
    );
  }

  const dimensions = readImageDimensions(source);

  if (!dimensions) {
    fail(`Source file is not a valid PNG/JPEG screenshot: ${source}`);
  }

  if (dimensions.width < MIN_WIDTH || dimensions.height < MIN_HEIGHT) {
    fail(`Screenshot is too small: ${dimensions.width}x${dimensions.height}. Use a normal browser-size screenshot.`);
  }

  copyFileSync(source, resolve(process.cwd(), OUTPUT));
  console.log(`[pass] Imported Novus/Pendo screenshot: ${source}`);
  console.log(`[check] Saved as ${OUTPUT} (${dimensions.width}x${dimensions.height})`);
}

function findBestScreenshot() {
  const candidates = [];
  const now = Date.now();

  for (const dir of uniqueExistingDirs(SEARCH_DIRS)) {
    for (const file of readdirSync(dir, { withFileTypes: true })) {
      if (!file.isFile()) {
        continue;
      }

      const path = join(dir, file.name);
      const name = file.name.toLowerCase();

      if (!/\.(png|jpe?g)$/.test(name)) {
        continue;
      }

      if (name.startsWith('launchproof-')) {
        continue;
      }

      const stats = statSync(path);

      if (now - stats.mtimeMs > DAY_MS) {
        continue;
      }

      const dimensions = readImageDimensions(path);

      if (!dimensions || dimensions.width < MIN_WIDTH || dimensions.height < MIN_HEIGHT) {
        continue;
      }

      const score = scoreCandidate(file.name, dir);

      if (score <= 0) {
        continue;
      }

      candidates.push({
        path,
        score,
        mtimeMs: stats.mtimeMs,
      });
    }
  }

  candidates.sort((left, right) => right.score - left.score || right.mtimeMs - left.mtimeMs);
  return candidates[0]?.path;
}

function uniqueExistingDirs(dirs) {
  return [...new Set(dirs.map((dir) => resolve(dir)))].filter((dir) => {
    try {
      return existsSync(dir) && statSync(dir).isDirectory();
    } catch (error) {
      console.error(`[fail] Could not inspect screenshot search directory: ${dir}`);
      console.error(error);
      return false;
    }
  });
}

function scoreCandidate(fileName, dir) {
  const haystack = `${basename(dir)} ${fileName}`.toLowerCase();
  let score = 0;

  for (const token of ['novus', 'pendo', 'dashboard']) {
    if (haystack.includes(token)) {
      score += 5;
    }
  }

  return score;
}

function readImageDimensions(imagePath) {
  const bytes = readImageBytes(imagePath);

  if (!bytes) {
    return null;
  }

  if (bytes.length >= 24 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return {
      width: bytes.readUInt32BE(16),
      height: bytes.readUInt32BE(20),
    };
  }

  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    return readJpegDimensions(bytes);
  }

  return null;
}

function readImageBytes(imagePath) {
  try {
    if (!statSync(imagePath).isFile()) {
      return null;
    }

    return readFileSync(imagePath);
  } catch (error) {
    console.error(`[fail] Could not read image file: ${imagePath}`);
    console.error(error);
    return null;
  }
}

function readJpegDimensions(bytes) {
  let offset = 2;

  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) {
      return null;
    }

    const marker = bytes[offset + 1];
    const length = bytes.readUInt16BE(offset + 2);

    if (marker >= 0xc0 && marker <= 0xc3) {
      return {
        height: bytes.readUInt16BE(offset + 5),
        width: bytes.readUInt16BE(offset + 7),
      };
    }

    offset += 2 + length;
  }

  return null;
}

function fail(message) {
  console.error(`[fail] ${message}`);
  process.exit(1);
}
