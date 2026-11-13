import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {poems,pictures,radicals,literacyBooks,readingsFor,readingLocation} from '../dist/literacy-data.js';
import {checkPoem,dailyPoem,validateLiteracy,mergeLiteracy,draftKey} from '../dist/literacy-core.js';
test('literacy material is complete, distinct and uses local illustrations',()=>{
 assert.equal(poems.length,82);assert.equal(pictures.length,6);assert.equal(radicals.length,24);const all=[...poems,...pictures,...radicals];assert.equal(new Set(all.map(x=>x.id)).size,all.length);
 for(const p of poems){assert(p.referenceOnly?p.lines.length===0:p.lines.length>=3);assert(p.author&&p.source.startsWith('https://'));}
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

test('six official books have distinct lesson and garden placements, keeping extracurricular poems separate',()=>{
 assert.deepEqual(literacyBooks.map(b=>b.id),['g2a','g2b','g3a','g3b','g4a','g4b']);
 assert.deepEqual(literacyBooks.map(b=>readingsFor(b.id).length),[12,12,13,13,13,13]);
 for(const b of literacyBooks){const list=readingsFor(b.id);assert(list.every(p=>p.source===b.source&&p.page>0));const gardens=readingsFor(b.id,'garden');assert.deepEqual(gardens.map(p=>p.unit),b.grade===2?[1,2,3,4,5,6,7,8]:[1,2,3,4,6,7,8]);}
 assert.deepEqual(readingsFor('g2a','garden','1').map(p=>p.title),['梅花']);
 assert.deepEqual(readingsFor('g2b','garden','8').map(p=>p.title),['江上渔者']);
 assert.equal(poems.find(p=>p.id==='deer').book,'g3a');assert.equal(poems.find(p=>p.id==='deer').kind,'lesson');
 assert.equal(readingsFor('extra').length,6);assert(readingsFor('extra').some(p=>p.id==='moon'));
 assert.match(readingLocation(poems.find(p=>p.id==='temple')),/语文园地七/);
 assert.equal(readingsFor('g4a','garden','5').length,0);
 const pool=readingsFor('g3b','garden','1');assert.equal(dailyPoem('2026-11-13',pool).id,'jiangnan');assert.equal(dailyPoem('2026-11-13',[]),undefined);
});
test('expanded literacy backups support all known drafts, but no reference-only auto-grading',()=>{
 const drafts=Object.fromEntries(poems.filter(p=>!p.referenceOnly).flatMap(p=>['next','full'].map(mode=>[draftKey('poem',p.id,mode),{text:'练习',updated:1}])));
 assert(Object.keys(drafts).length>100);assert.deepEqual(validateLiteracy({drafts}).drafts,drafts);
 assert.throws(()=>validateLiteracy({drafts:{'poem:mao-plum:full':{text:'test',updated:1}}}));
});
