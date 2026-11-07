import {audioMap} from './audio-map.js';
let current=null,utterance=null,resolveCurrent=null,token=0;
export function stopAudio(){token++;const finish=resolveCurrent;resolveCurrent=null;if(finish)finish();if(current){current.pause();current=null;}if('speechSynthesis'in window)speechSynthesis.cancel();utterance=null;}
export async function speak(text,rate=0.9){
 stopAudio();const own=token;
 if(audioMap[text]){
  try{await new Promise((resolve,reject)=>{
   const a=new Audio(audioMap[text]);current=a;a.playbackRate=rate;let settled=false;
   const finish=error=>{if(settled)return;settled=true;clearTimeout(timer);a.onended=null;a.onerror=null;if(current===a)current=null;resolveCurrent=null;error?reject(error):resolve();};
   const timer=setTimeout(()=>{a.pause();finish(Error('声音加载超时，请联网重试。'));},20000);
   resolveCurrent=()=>{a.pause();finish();};a.onended=()=>finish();a.onerror=()=>finish(Error('音频未下载'));a.play().catch(e=>finish(e));
  });return;}catch{if(own!==token)return;}
 }
 if(!('speechSynthesis'in window))throw Error('声音暂时无法播放。请联网重试，或让家长朗读。');
 return new Promise((resolve,reject)=>{
  const voices=speechSynthesis.getVoices(),v=voices.find(v=>/zh[-_]CN/i.test(v.lang))||voices.find(v=>/zh[-_]Hans/i.test(v.lang));
  if(voices.length&&!v){reject(Error('没有找到普通话语音。请联网下载离线声音包后再试。'));return;}
  const u=new SpeechSynthesisUtterance(text);utterance=u;u.lang='zh-CN';u.rate=rate;u.pitch=1;if(v)u.voice=v;let settled=false;
  const finish=error=>{if(settled)return;settled=true;clearTimeout(timer);resolveCurrent=null;u.onend=null;u.onerror=null;error?reject(error):resolve();};
  const timer=setTimeout(()=>{finish(Error('声音未能完成。请检查音量，再点一次播放。'));speechSynthesis.cancel();},20000);
  resolveCurrent=()=>finish();u.onend=()=>finish();u.onerror=e=>finish(['interrupted','canceled'].includes(e.error)?null:Error('声音播放失败。请检查音量或联网后重试。'));speechSynthesis.speak(u);
 });
}
let recorder=null,stream=null,recordUrl=null,timeout=null,recordEpoch=0;
export function releaseRecording(){recordEpoch++;clearTimeout(timeout);if(recorder?.state==='recording')recorder.stop();stream?.getTracks().forEach(t=>t.stop());stream=null;recorder=null;if(recordUrl){URL.revokeObjectURL(recordUrl);recordUrl=null;}}
export async function startRecording(onStop){
 releaseRecording();const epoch=recordEpoch;
 if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)throw Error('当前浏览器不支持录音。请在 iPad Safari 中打开；也可以直接跟读。');
 try{const s=await navigator.mediaDevices.getUserMedia({audio:true});if(epoch!==recordEpoch){s.getTracks().forEach(t=>t.stop());return;}stream=s;
 const chunks=[];recorder=new MediaRecorder(stream);const thisRecorder=recorder;recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
 recorder.onstop=()=>{s.getTracks().forEach(t=>t.stop());clearTimeout(timeout);if(epoch!==recordEpoch)return;recordUrl=URL.createObjectURL(new Blob(chunks,{type:thisRecorder.mimeType||'audio/mp4'}));onStop(recordUrl);};
 recorder.start();timeout=setTimeout(stopRecording,30000);return true;
 }catch{releaseRecording();throw Error('没有获得麦克风权限。可在浏览器设置中允许，或直接跟读。');}
}
export function stopRecording(){clearTimeout(timeout);if(recorder?.state==='recording')recorder.stop();stream?.getTracks().forEach(t=>t.stop());}
