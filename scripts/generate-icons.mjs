// Build-time only: pass the local sharp module path when not installed in this project.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const {default:sharp}=await import(process.env.SHARP_MODULE||'sharp');
const source=new URL('../dist/icon.svg',import.meta.url);
for(const size of [192,512]){const target=new URL(`../dist/icon-${size}.png`,import.meta.url);await sharp(await fs.readFile(source)).resize(size,size).png().toFile(fileURLToPath(target));const meta=await sharp(await fs.readFile(target)).metadata();assert.equal(meta.width,size);assert.equal(meta.height,size);}
