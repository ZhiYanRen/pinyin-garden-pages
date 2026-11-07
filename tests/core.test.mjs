import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePinyin, gradePinyin, updateMistake, recordAnswer, validateBackup, createSession, localDay } from '../dist/core.js';
test('tones are required and ü is distinct from u',()=>{
 assert(gradePinyin('lǜ sè','lǜ sè')); assert(gradePinyin('lü4 se4','lǜ sè')); assert(gradePinyin('lv4 se4','lǜ sè'));
 assert(!gradePinyin('lu4 se4','lǜ sè')); assert(!gradePinyin('lv se','lǜ sè')); assert(!gradePinyin('ān','áng'));
 assert.equal(normalizePinyin(' LǛ  SÈ '),'lǜ sè'); assert(gradePinyin('xian1','xiān')); assert(!gradePinyin('xi an','xī ān'));
});
test('mistake remains due after correction; delayed correct review schedules 1/3/7 days',()=>{
 const t=1000000000; let m=updateMistake(null,{id:'a',text:'八'},false,t,false);
 assert.equal(m.streak,0); assert.equal(m.due,t+86400000);
 m=updateMistake(m,{id:'a'},true,t+1000,false); assert.equal(m.streak,0);
 m=updateMistake(m,{id:'a'},true,t+86400000,true); assert.equal(m.streak,1); assert.equal(m.due,t+4*86400000);
 m=updateMistake(m,{id:'a'},true,m.due,true); assert.equal(m.streak,2);
 m=updateMistake(m,{id:'a'},false,m.due,true); assert.equal(m.streak,0);
});
test('duplicate grading is idempotent; session progress tracks original IDs',()=>{
 let s=createSession([{id:'a',text:'八',pinyin:'bā'},{id:'b',text:'怕',pinyin:'pà'}],{mode:'choose',title:'练习'},1);
 s=recordAnswer(s,true,'bā',2); const again=recordAnswer(s,false,'pā',3);
 assert.deepEqual(again,s); assert.equal(s.results.length,1); assert.equal(s.results[0].id,'a');
});
test('untrusted backups validate schema, version, size and finite counters',()=>{
 assert.throws(()=>validateBackup({version:999})); assert.throws(()=>validateBackup({version:1,history:[],mistakes:{x:{streak:Infinity}}}));
 const b=validateBackup({version:1,history:[],mistakes:{},settings:{rate:0.8}}); assert.equal(b.version,1);
});
test('localDay uses local calendar, not UTC truncation',()=>{const d=new Date(2026,10,6,0,30);assert.equal(localDay(d),'2026-11-06');});
test('apostrophe rules cannot be bypassed by omitting the mark',()=>{assert(!gradePinyin('píao','pí\'ǎo'));assert(!gradePinyin('píǎo','pí\'ǎo'));assert(gradePinyin('pi2\'ao3','pí\'ǎo'));});
test('three spaced reviews occur after 1, then 3, then 7 days before mastery',()=>{const day=86400000;let m=updateMistake(null,{id:'x'},false,0,false);assert.equal(m.due,day);m=updateMistake(m,{id:'x'},true,day,true);assert.equal(m.due,4*day);m=updateMistake(m,{id:'x'},true,4*day,true);assert.equal(m.due,11*day);assert.equal(m.streak,2);m=updateMistake(m,{id:'x'},true,11*day,true);assert.equal(m.streak,3);});
test('homophone dictation includes spoken context, pinyin does not',async()=>{const {dictationText}=await import('../dist/core.js');assert.match(dictationText({text:'他们',kind:'word'},'write'),/同学/);assert.match(dictationText({text:'它们',kind:'word'},'paper'),/小猫/);assert.equal(dictationText({text:'他们',kind:'word'},'type'),'他们');});
