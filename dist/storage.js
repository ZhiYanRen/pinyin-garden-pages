import {validateLiteracy,mergeLiteracy} from './literacy-core.js';
import {validateBackup} from './core.js';
import {DEFAULT_RATE} from './audio-settings.js';
export const KEY='pinyin-garden-v1';
export function fresh(){return {version:1,audioProfile:2,includeSupplements:false,literacy:validateLiteracy(),history:[],mistakes:{},settings:{rate:DEFAULT_RATE,mode:'write',count:10},session:null,book:'g2a',unit:1,updated:0};}
export function load(){
 try{const raw=localStorage.getItem(KEY);if(!raw)return {state:fresh()};const o=JSON.parse(raw);const clean=validateBackup(o);
 if(o.audioProfile!==2)clean.settings.rate=Math.min(clean.settings.rate,DEFAULT_RATE);
 let session=null;
 if(o.session&&Array.isArray(o.session.items)&&o.session.items.length<=1000&&Number.isInteger(o.session.index)&&o.session.index>=0&&o.session.index<=o.session.items.length&&Array.isArray(o.session.results)) session={...o.session,heard:o.audioProfile===2?!!o.session.heard:false};
 return {state:{...fresh(),...clean,audioProfile:2,includeSupplements:o.includeSupplements===true,session,book:typeof o.book==='string'?o.book:'g2a',unit:Number.isInteger(o.unit)?o.unit:1,updated:o.updated||0}};
 }catch{return {state:fresh(),error:'学习记录暂时读不出来。请先导出或保留原备份；本次可以继续练习。'};}
}
export function save(state){try{state.updated=Date.now();localStorage.setItem(KEY,JSON.stringify(state));return true;}catch{return false;}}
export function mergeBackup(state,data,catalog){const b=validateBackup(data);const history=[...new Map([...state.history,...b.history.filter(r=>catalog.has(r.id))].map(r=>[r.key,r])).values()].sort((a,b)=>a.at-b.at).slice(-5000);
 const mistakes={...state.mistakes};for(const [id,m] of Object.entries(b.mistakes)){if(catalog.has(id)&&(!mistakes[id]||m.last>mistakes[id].last))mistakes[id]=m;}return {...state,history,mistakes,literacy:mergeLiteracy(state.literacy,b.literacy)};}
