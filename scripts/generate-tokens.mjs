import fs from 'node:fs';
const md=fs.readFileSync(new URL('../DESIGN.md',import.meta.url),'utf8');const block=md.match(/colors:\n([\s\S]*?)typography:/)[1];const colors=[...block.matchAll(/  ([\w-]+): "(#[A-Fa-f0-9]+)"/g)];fs.writeFileSync(new URL('../dist/tokens.css',import.meta.url),`/* Generated from DESIGN.md */\n:root{${colors.map(([,n,v])=>`--${n}:${v};`).join('')}}\n`);
