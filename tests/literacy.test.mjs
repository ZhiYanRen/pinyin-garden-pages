import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {poems,pictures,radicals} from '../dist/literacy-data.js';
import {checkPoem,dailyPoem,validateLiteracy,mergeLiteracy,draftKey} from '../dist/literacy-core.js';
test('literacy material is complete, distinct and uses local illustrations',()=>{
 assert.equal(poems.length,13);assert.equal(pictures.length,6);assert.equal(radicals.length,24);const all=[...poems,...pictures,...radicals];assert.equal(new Set(all.map(x=>x.id)).size,all.length);
 for(const p of poems){assert(p.lines.length>=4);assert(p.author&&p.source.startsWith('https://'));}
 for(const p of pictures){assert(fs.existsSync(new URL('../dist/'+p.image,import.meta.url)));assert(p.alt&&p.questions.length===4&&p.sample);}
 for(const r of radicals){assert.equal(new Set([r.examples[0],...r.others]).size,3);assert(r.parent&&r.hint);}
});
test('poem checking ignores punctuation and whitespace but checks every character',()=>{
 assert(checkPoem(' 床前明月光\n疑是地上霜 ',['床前明月光，','疑是地上霜。']).correct);
 assert(!checkPoem('床前明月光，疑是地上雪。',['床前明月光，','疑是地上霜。']).correct);
 assert(!checkPoem('',poems[0].lines).correct);
 assert.equal(dailyPoem('2026-11-09').id,dailyPoem('2026-11-09').id);assert(dailyPoem('2026-11-10'));
});
test('new learning records validate limits and merge without losing newer drafts',()=>{
 const key=draftKey('picture','umbrella');const a=validateLiteracy({drafts:{[key]:{text:'我的草稿',updated:20}},learned:{moon:10},radicals:{water:{attempts:2,correct:1,updated:20}}});
 const b=validateLiteracy({drafts:{[key]:{text:'旧备份',updated:10}},learned:{snow:15}});
 const m=mergeLiteracy(a,b);assert.equal(m.drafts[key].text,'我的草稿');assert.equal(m.learned.snow,15);assert.equal(m.learned.moon,10);
 assert.deepEqual(validateLiteracy(undefined),{drafts:{},learned:{},radicals:{}});
 assert.throws(()=>validateLiteracy({drafts:{[key]:{text:'x'.repeat(1001),updated:1}}}));assert.throws(()=>validateLiteracy({radicals:{water:{attempts:1,correct:2,updated:1}}}));assert.throws(()=>validateLiteracy({drafts:{unknown:{text:'x',updated:1}}}));
});
test('existing backup flow includes new records and keeps newer local writing',async()=>{
 const {fresh,mergeBackup}=await import('../dist/storage.js');const state=fresh();const key=draftKey('picture','umbrella');state.literacy.drafts[key]={text:'本机更新的文字',updated:30};
 const backup={version:1,history:[],mistakes:{},settings:state.settings,literacy:{drafts:{[key]:{text:'备份旧文字',updated:10}},learned:{moon:20}}};
 const merged=mergeBackup(state,backup,new Map());assert.equal(merged.literacy.drafts[key].text,'本机更新的文字');assert.equal(merged.literacy.learned.moon,20);assert.equal(state.literacy.learned.moon,undefined);
 const old=mergeBackup(merged,{version:1,history:[],mistakes:{},settings:state.settings},new Map());assert.equal(old.literacy.drafts[key].text,'本机更新的文字');
});
