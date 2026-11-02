#!/usr/bin/env node
// Renderar reklamfilmen (film/kalla/film.html) bildruta för bildruta och
// kodar den till MP4 med ffmpeg.
//
//   node film/render.mjs            båda formaten
//   node film/render.mjs 16x9       bara liggande
//   node film/render.mjs 9x16 --stills   bara stående + några stillbilder
//
// Kräver Playwright (npm i -D playwright && npx playwright install chromium) och ffmpeg.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const DIR = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(DIR, 'kalla', 'film.html');
const FPS = 30;
const args = process.argv.slice(2);
const formats = { '16x9': [1920, 1080], '9x16': [1080, 1920] };
const wanted = args.filter((a) => formats[a]);
const list = wanted.length ? wanted : Object.keys(formats);

const browser = await chromium.launch();
for (const fmt of list) {
  const [w, h] = formats[fmt];
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(SRC).href + `?format=${fmt}&render=1`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))));
  const duration = await page.evaluate(() => window.DURATION);
  const frames = Math.round(duration * FPS);
  const out = path.join(DIR, `projekteffektivitet-reklamfilm-${fmt}.mp4`);

  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg ' + c)))));

  for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => window.render(t), i / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 150 === 0) process.stdout.write(`${fmt}: ${i}/${frames}\n`);
  }
  ff.stdin.end();
  await done;

  // Affisch (stillbild) för förhandsvisning
  await page.evaluate((t) => window.render(t), 9.6);
  await page.screenshot({ path: path.join(DIR, `affisch-${fmt}.jpg`), type: 'jpeg', quality: 85 });
  if (args.includes('--stills')) {
    for (const t of [1.5, 4.5, 9.6, 14.6, 20]) {
      await page.evaluate((x) => window.render(x), t);
      await page.screenshot({ path: path.join(DIR, `still-${fmt}-${t}.jpg`), type: 'jpeg', quality: 80 });
    }
  }
  await page.close();
  console.log('Klar:', path.relative(process.cwd(), out));
}
await browser.close();
