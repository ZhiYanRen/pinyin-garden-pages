import test from 'node:test';import assert from 'node:assert/strict';
import {speak,stopAudio} from '../dist/media.js';
test('a stalled speech engine rejects instead of falsely reporting success',async()=>{const timer=globalThis.setTimeout;globalThis.window={speechSynthesis:{}};globalThis.speechSynthesis={cancel(){},getVoices(){return[{lang:'zh-CN'}];},speak(){}};globalThis.SpeechSynthesisUtterance=class{constructor(t){this.text=t;}};globalThis.setTimeout=(f)=>timer(f,1);try{await assert.rejects(speak('测试超时语句'),/声音/);}finally{globalThis.setTimeout=timer;stopAudio();delete globalThis.window;delete globalThis.speechSynthesis;delete globalThis.SpeechSynthesisUtterance;}});
test('audio is slower, pitch-preserving and only reports completed playback',async()=>{
 const made=[];globalThis.window={};globalThis.Audio=class{constructor(src){this.src=src;made.push(this);}play(){return Promise.resolve();}pause(){}};
 try{const pending=speak('你好，我们一起练习拼音。');assert.equal(made[0].playbackRate,0.75);assert.equal(made[0].preservesPitch,true);stopAudio();assert.equal(await pending,false);
 const completed=speak('你好，我们一起练习拼音。',0.6);made[1].onended();assert.equal(await completed,true);
 }finally{stopAudio();delete globalThis.window;delete globalThis.Audio;}
});
