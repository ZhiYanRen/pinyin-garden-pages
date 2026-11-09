import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {audioMap} from '../dist/audio-map.js';import {AUDIO_CACHE} from '../dist/audio-settings.js';import {topics,soundGroups} from '../dist/pinyin-data.js';import {curriculum} from '../dist/curriculum.js';import {dictationPrompts} from '../dist/core.js';
test('every learning prompt has a deployable audio clip and the offline cache uses the new pack',()=>{
 const required=[...Object.values(dictationPrompts),...topics.flatMap(t=>t.items.map(q=>q.text)),...soundGroups.flatMap(g=>g.items.map(q=>q.example)),...curriculum.flatMap(b=>b.units.flatMap(u=>u.lessons.flatMap(l=>l.words.map(w=>w.text))))];
 for(const text of required){const file=audioMap[text];assert(file,`missing recording: ${text}`);assert(!file.startsWith('/'));assert(fs.statSync(new URL('../dist/'+file,import.meta.url)).size>100);}
 assert.equal(fs.readdirSync(new URL('../dist/audio/',import.meta.url)).filter(f=>f.endsWith('.mp3')).length,Object.keys(audioMap).length);
 assert(fs.readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8').includes(`AUDIO='${AUDIO_CACHE}'`));
 const info=JSON.parse(fs.readFileSync(new URL('../AUDIO.json',import.meta.url)));assert.equal(info.rate,135);assert.equal(info.clips,Object.keys(audioMap).length);
});
