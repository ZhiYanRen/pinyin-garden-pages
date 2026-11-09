import {validateLiteracy} from './literacy-core.js';
import {DEFAULT_RATE,SPEECH_RATES} from './audio-settings.js';
const tones={a:'āáǎà',e:'ēéěè',i:'īíǐì',o:'ōóǒò',u:'ūúǔù',ü:'ǖǘǚǜ'};
export function normalizePinyin(input){
 return String(input).normalize('NFC').toLowerCase().trim().replace(/u:|v/g,'ü').replace(/([a-zü]+)([0-5])/g,(_,s,n)=>{
  const t=Number(n);if(!t||t===5)return s;
  let i=s.indexOf('a');if(i<0)i=s.indexOf('e');if(i<0&&s.includes('ou'))i=s.indexOf('o');
  if(i<0)for(let j=s.length-1;j>=0;j--)if(tones[s[j]]){i=j;break;}
  return i<0?s:s.slice(0,i)+tones[s[i]][t-1]+s.slice(i+1);
 }).replace(/[’‘]/g,"'").replace(/\s+/g,' ');
}
export function gradePinyin(answer,expected){const flat=s=>normalizePinyin(s).replace(/\s/g,'');return flat(answer)===flat(expected)&&flat(answer).length>0;}
export function localDay(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function shuffled(items,rng=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function createSession(items,config={},now=Date.now()){
 return {id:`${now}-${Math.random().toString(36).slice(2,8)}`,title:config.title||'拼音练习',mode:config.mode||'choose',review:!!config.review,origin:config.origin||'home',items:items.map(x=>({...x,options:x.options?shuffled(x.options):undefined})),index:0,results:[],revealed:false,draft:'',strokes:[],created:now};
}
export function recordAnswer(session,correct,answer,now=Date.now()){
 if(session.results.some(r=>r.index===session.index))return session;
 return {...session,revealed:true,results:[...session.results,{index:session.index,id:session.items[session.index].id,correct:!!correct,answer:String(answer).slice(0,120),at:now}]};
}
export function updateMistake(previous,item,correct,now=Date.now(),review=false){
 if(!previous&&correct)return null;
 if(!correct)return {id:item.id,errors:(previous?.errors||0)+1,streak:0,due:now+86400000,last:now,created:previous?.created||now};
 if(!review||now<previous.due)return previous;
 const streak=Math.min(3,previous.streak+1);return {...previous,streak,last:now,due:streak>=3?now:now+[3,7][streak-1]*86400000};
}
export function validateBackup(data){
 if(!data||data.version!==1||!Array.isArray(data.history)||!data.mistakes||typeof data.mistakes!=='object'||Array.isArray(data.mistakes))throw Error('不是本软件的备份文件。');
 if(data.history.length>5000||Object.keys(data.mistakes).length>5000)throw Error('备份记录过多。');
 const mistakes={};for(const [id,m] of Object.entries(data.mistakes)){
  if(!/^[a-z0-9_-]{1,100}$/i.test(id)||!m||![m.streak,m.errors,m.due,m.last,m.created].every(Number.isFinite)||m.streak<0||m.streak>3||m.errors<0)throw Error('错题记录格式不正确。');
  mistakes[id]={id,streak:Math.floor(m.streak),errors:Math.floor(m.errors),due:m.due,last:m.last,created:m.created,...(['声母','韵母','声调','汉字'].includes(m.reason)?{reason:m.reason}:{})};
 }
 const history=data.history.map(r=>{if(!r||typeof r.key!=='string'||r.key.length>150||typeof r.id!=='string'||r.id.length>100||!Number.isFinite(r.at)||typeof r.correct!=='boolean')throw Error('学习记录格式不正确。');return {key:r.key,id:r.id,at:r.at,correct:r.correct,mode:['choose','type','write','paper'].includes(r.mode)?r.mode:'write'};});
 const settings={rate:SPEECH_RATES.some(([rate])=>rate===data.settings?.rate)?data.settings.rate:DEFAULT_RATE,mode:['write','paper','type'].includes(data.settings?.mode)?data.settings.mode:'write',count:[6,10,15].includes(data.settings?.count)?data.settings.count:10};
 return {version:1,history,mistakes,settings,literacy:validateLiteracy(data.literacy)};
}
export const dictationPrompts={
 '他们':'他们。例句：他们是我的同学。请写词语：他们。',
 '它们':'它们。例句：两只小猫睡着了，它们很可爱。请写词语：它们。',
 '仙人':'仙人。提示：神话故事里有法术的人。请写词语：仙人。',
 '先人':'先人。提示：已经去世的祖先。请写词语：先人。'
};
export function dictationText(item,mode){return item.kind==='word'&&['write','paper'].includes(mode)?dictationPrompts[item.text]||item.text:item.text;}
