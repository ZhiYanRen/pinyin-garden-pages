// A completed shell replaces the old worker; reload only after local work is safe.
export function autoUpdates({serviceWorker,saveCurrent,canReload,reload,onError,listen=document,online=window}){
 let controlled=!!serviceWorker.controller,pending=false,reloading=false,timer;
 const attempt=()=>{clearTimeout(timer);if(!pending||reloading)return;if(!canReload()||!saveCurrent()){timer=setTimeout(attempt,500);return;}reloading=true;reload();};
 serviceWorker.addEventListener('controllerchange',()=>{if(controlled){pending=true;attempt();}controlled=true;});
 listen.addEventListener('compositionend',()=>setTimeout(attempt,0));listen.addEventListener('pointerup',()=>setTimeout(attempt,0));
 serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(reg=>{
  const activate=()=>reg.waiting?.postMessage({type:'SKIP_WAITING'});activate();
  reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed')activate();});});
  const check=()=>reg.update().catch(()=>{});online.addEventListener('online',check);listen.addEventListener('visibilitychange',()=>{if(!listen.hidden)check();});setInterval(()=>{if(!listen.hidden)check();},60000);check();
 }).catch(onError);
}
