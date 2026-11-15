import {poems,pictures,radicals} from './literacy-data.js';
export const draftKey=(kind,id,mode='')=>[kind,id,mode].filter(Boolean).join(':');
const draftIds=new Set([...pictures.map(p=>draftKey('picture',p.id)),...poems.flatMap(p=>(p.referenceOnly?[]:['next','full']).map(mode=>draftKey('poem',p.id,mode)))]);
export function checkPoem(answer,lines){const text=s=>String(s).normalize('NFC').replace(/[\p{P}\s]/gu,'');const expected=text(lines.join(''));const actual=text(answer);return {correct:actual.length>0&&actual===expected,expected:lines.join(''),actual};}
export function dailyPoem(day,pool=poems){const n=Math.floor(Date.parse(day+'T00:00:00Z')/86400000);return pool[(Number.isFinite(n)?Math.abs(n):0)%pool.length];}
export function validateLiteracy(value){
 const clean={drafts:{},learned:{},radicals:{},mistakes:{}};if(value===undefined)return clean;
 const object=v=>v&&typeof v==='object'&&!Array.isArray(v);const stamp=n=>Number.isFinite(n)&&n>=0;
 if(!object(value))throw Error('语文积累记录格式不正确。');
 for(const kind of ['drafts','learned','radicals']){
  const entries=value[kind]??{};if(!object(entries)||Object.keys(entries).length>({drafts:draftIds.size,learned:poems.length,radicals:radicals.length})[kind])throw Error('语文积累记录过多或格式不正确。');
  for(const [id,entry] of Object.entries(entries)){
   if(kind==='drafts'){if(!draftIds.has(id)||!object(entry)||typeof entry.text!=='string'||entry.text.length>1000||!stamp(entry.updated))throw Error('写作草稿格式不正确。');clean.drafts[id]={text:entry.text,updated:entry.updated};}
   if(kind==='learned'){if(!poems.some(p=>p.id===id)||!stamp(entry))throw Error('古诗积累记录格式不正确。');clean.learned[id]=entry;}
   if(kind==='radicals'){if(!radicals.some(r=>r.id===id)||!object(entry)||![entry.attempts,entry.correct].every(n=>Number.isInteger(n)&&n>=0&&n<=100000)||entry.correct>entry.attempts||!stamp(entry.updated))throw Error('偏旁练习记录格式不正确。');clean.radicals[id]={attempts:entry.attempts,correct:entry.correct,updated:entry.updated};}
  }
 }
 const entries=value.mistakes??{};
 if(!object(entries)||Object.keys(entries).length>poems.length*3+radicals.length+pictures.length)throw Error('积累错题记录格式不正确。');
 for(const [key,m] of Object.entries(entries)){
  if(!object(m)||!['poem','radical','picture'].includes(m.kind)||typeof m.id!=='string'||!({poem:poems,radical:radicals,picture:pictures}[m.kind]).some(x=>x.id===m.id)||!['next','full','paper','quiz','writing'].includes(m.mode)||key!==[m.kind,m.id,m.mode].join(':')||typeof m.answer!=='string'||m.answer.length>1000||!Number.isInteger(m.errors)||m.errors<1||m.errors>100000||!stamp(m.updated)||!stamp(m.created)||typeof m.resolved!=='boolean')throw Error('积累错题记录格式不正确。');
  clean.mistakes[key]={kind:m.kind,id:m.id,mode:m.mode,answer:m.answer,errors:m.errors,updated:m.updated,created:m.created,resolved:m.resolved};
 }
 return clean;
}
export function mergeLiteracy(current,incoming){const a=validateLiteracy(current),b=validateLiteracy(incoming);for(const kind of ['drafts','radicals','mistakes'])for(const [id,entry] of Object.entries(b[kind]))if(!a[kind][id]||entry.updated>a[kind][id].updated)a[kind][id]=entry;for(const [id,at] of Object.entries(b.learned))a.learned[id]=Math.max(a.learned[id]||0,at);return a;}

// Every explicit assessment shares this persistent record, including self-assessment.
export function recordLiteracyAnswer(record,kind,id,mode,answer,correct,now=Date.now()){
 const key=[kind,id,mode].join(':');record.mistakes??={};const old=record.mistakes[key];
 if(correct){if(old)record.mistakes[key]={...old,resolved:true,updated:now};return;}
 record.mistakes[key]={kind,id,mode,answer:String(answer).slice(0,1000),errors:Math.min(100000,(old?.errors||0)+1),created:old?.created??now,updated:now,resolved:false};
}
