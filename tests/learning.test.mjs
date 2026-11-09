import test from 'node:test';import assert from 'node:assert/strict';
import {pinyinFeedback,selectPractice,modeFor,canSubmit} from '../dist/learning.js';
test('feedback distinguishes tones, tone placement, initials, finals and apostrophes',()=>{
 assert.match(pinyinFeedback('ma','mǎ'),/声调/);assert.match(pinyinFeedback('má','mǎ'),/声调/);
 assert.match(pinyinFeedback('shǔi','shuǐ'),/位置/);assert.match(pinyinFeedback('pā','bā'),/声母/);
 assert.match(pinyinFeedback('xīn','xīng'),/韵母/);assert.match(pinyinFeedback('xīān',"xī'ān"),/隔音/);
 assert.equal(pinyinFeedback('lv4','lǜ'),'');assert.match(pinyinFeedback('mā mā','mā ma'),/轻声/);
});
test('practice prioritizes due mistakes and unseen items without duplicates or unrelated IDs',()=>{
 const items=['a','b','c','d'].map(id=>({id}));const history=[{id:'a',at:1,correct:true},{id:'d',at:2,correct:true}];
 const result=selectPractice(items,history,{b:{id:'b',streak:0,due:5},z:{id:'z',due:0,streak:0}},3,10,()=>0.5);
 assert.equal(result[0].id,'b');assert.equal(result[1].id,'c');assert.equal(new Set(result.map(q=>q.id)).size,3);
 assert.equal(selectPractice([],history,{},10).length,0);
});
test('mixed practice uses item modes and every answer must follow successful audio',()=>{
 assert.equal(modeFor({mode:'choose',items:[{practiceMode:'type'}],index:0}),'type');
 assert.equal(modeFor({mode:'paper',items:[{}],index:0}),'paper');
 assert(!canSubmit({heard:false}));assert(canSubmit({heard:true}));
 assert(!canSubmit({heard:true,revealed:true}));
});
test('old records migrate once to recommended slow speed without losing progress',async()=>{
 const {load,save,KEY}=await import('../dist/storage.js');let raw=JSON.stringify({version:1,history:[{key:'k',id:'bp-1',at:1,correct:false,mode:'type'}],mistakes:{},settings:{rate:0.9,mode:'type',count:10}});
 globalThis.localStorage={getItem(){return raw;},setItem(key,value){assert.equal(key,KEY);raw=value;}};
 try{const {state}=load();assert.equal(state.settings.rate,0.75);assert.equal(state.history.length,1);state.settings.rate=0.6;save(state);assert.equal(load().state.settings.rate,0.6);}finally{delete globalThis.localStorage;}
});
