import {normalizePinyin,shuffled} from './core.js';
const plain=s=>normalizePinyin(s).normalize('NFD').replace(/[\u0304\u0301\u030c\u0300]/g,'').normalize('NFC').replace(/\s/g,'');
const tonePattern=s=>[...normalizePinyin(s).normalize('NFD')].filter(c=>/[\u0304\u0301\u030c\u0300]/.test(c)).join('');
export function pinyinFeedback(answer,expected){
 const a=normalizePinyin(answer).replace(/\s/g,''),e=normalizePinyin(expected).replace(/\s/g,'');if(a===e)return '';
 if(a.replace(/'/g,'')===e.replace(/'/g,''))return '检查隔音符号：后一个音节以 a、o、e 开头，连写时要分清界限。';
 if(plain(a)===plain(e))return tonePattern(a)===tonePattern(e)?'音听对了，再检查调号的位置：有 a 找 a，iu、ui 标后面。':'字母基本写对了，再听声调：检查有没有漏标、标错或把轻声标了调号。';
 const initial=s=>plain(s).match(/^(zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])/)?.[0]||'';
 return initial(a)!==initial(e)?'重点听声母：比较开头的音，留意送气和舌尖位置。':'重点听韵母：留意前后鼻音、ü 的两点和有没有漏掉介音；也检查音节是否写全。';
}
export function selectPractice(items,history,mistakes,count,now=Date.now(),rng=Math.random){
 const seen=new Set(history.map(r=>r.id));
 const priority=q=>{const m=mistakes[q.id];return m&&m.streak<3?(m.due<=now?0:1):seen.has(q.id)?3:2;};
 return shuffled([...new Map(items.map(q=>[q.id,q])).values()],rng).sort((a,b)=>priority(a)-priority(b)).slice(0,count);
}
export const modeFor=session=>session.items[session.index]?.practiceMode||session.mode;
export const canSubmit=session=>!!session?.heard&&!session.revealed;
