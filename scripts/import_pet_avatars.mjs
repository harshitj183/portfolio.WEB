/**
 * Copies pet plugin avatar images into public/avatar/ and converts them to webp.
 * Uses sharp (already in node_modules) for PNG → WebP conversion.
 */
import sharp from 'sharp';
import { copyFile, mkdir, readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const SRC_BASE = '/home/harshitj183/Downloads/download_from_browser/pets-plugin-work-pets-openai-curated/outputs/aero-portfolio-pack';
const DEST_DIR = '/home/harshitj183/Downloads/portfolio 2026/public/avatar';

async function convertToWebp(srcPng, destWebp) {
  await sharp(srcPng)
    .webp({ quality: 85 })
    .toFile(destWebp);
  const srcSize = (await stat(srcPng)).size;
  const destSize = (await stat(destWebp)).size;
  console.log(`  ${path.basename(destWebp)}: ${(srcSize/1024).toFixed(0)}KB → ${(destSize/1024).toFixed(0)}KB`);
}

async function main() {
  // 1. Copy decoded single-frame PNGs → webp
  console.log('=== Converting decoded single-frame images ===');
  const decodedDir = path.join(SRC_BASE, 'decoded');
  const decodedFiles = (await readdir(decodedDir)).filter(f => f.endsWith('.png'));
  
  for (const file of decodedFiles) {
    const name = path.basename(file, '.png');
    const srcPath = path.join(decodedDir, file);
    const destPath = path.join(DEST_DIR, `pet_${name}.webp`);
    await convertToWebp(srcPath, destPath);
  }

  // 2. Copy frame sequences for animation
  console.log('\n=== Converting frame sequences ===');
  const rowsDir = path.join(SRC_BASE, 'qa', 'rows');
  const activities = (await readdir(rowsDir)).filter(d => {
    const framesDir = path.join(rowsDir, d, 'frames', d);
    return existsSync(framesDir);
  });

  for (const activity of activities) {
    const framesDir = path.join(rowsDir, activity, 'frames', activity);
    const frameFiles = (await readdir(framesDir)).filter(f => f.endsWith('.png')).sort();
    console.log(`  ${activity}: ${frameFiles.length} frames`);
    
    for (const frame of frameFiles) {
      const frameNum = parseInt(path.basename(frame, '.png'), 10);
      const srcPath = path.join(framesDir, frame);
      const destPath = path.join(DEST_DIR, `pet_${activity}_${frameNum}.webp`);
      await convertToWebp(srcPath, destPath);
    }
  }

  // 3. Copy cardinals (look directions)
  console.log('\n=== Converting cardinal look directions ===');
  const cardinalsDir = path.join(SRC_BASE, 'qa', 'cardinals');
  if (existsSync(cardinalsDir)) {
    const cardinalFiles = (await readdir(cardinalsDir)).filter(f => f.endsWith('.png'));
    for (const file of cardinalFiles) {
      const name = path.basename(file, '.png');
      const srcPath = path.join(cardinalsDir, file);
      const destPath = path.join(DEST_DIR, `pet_look_${name}.webp`);
      await convertToWebp(srcPath, destPath);
    }
  }

  // 4. Copy reference avatar
  console.log('\n=== Converting reference avatar ===');
  const refPath = path.join(SRC_BASE, 'reference-avatar.png');
  if (existsSync(refPath)) {
    await convertToWebp(refPath, path.join(DEST_DIR, 'pet_reference.webp'));
  }

  console.log('\n=== Done! All pet avatar images imported. ===');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
