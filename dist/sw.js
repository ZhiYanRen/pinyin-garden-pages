const SHELL='pinyin-shell-3458b3a83007',AUDIO='pinyin-audio-v2';
const FILES=['./','./index.html','./styles.css','./tokens.css','./app.js','./core.js','./learning.js','./literacy-data.js','./literacy-core.js','./literacy-ui.js','./literacy/umbrella.svg','./literacy/tree.svg','./literacy/kite.svg','./literacy/clean.svg','./literacy/cat.svg','./literacy/books.svg','./audio-settings.js','./storage.js','./media.js','./drawing.js','./pinyin-data.js','./curriculum.js','./audio-map.js','./icon.svg','./icon-192.png','./icon-512.png','./manifest.webmanifest'];
self.addEventListener('install',event=>event.waitUntil(caches.open(SHELL).then(c=>c.addAll(FILES))));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('pinyin-shell-')&&k!==SHELL).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',event=>{const url=new URL(event.request.url),base=new URL(self.registration.scope);if(event.request.method!=='GET'||url.origin!==base.origin)return;
 const rel=url.pathname.slice(base.pathname.length);if(!FILES.some(f=>f.replace('./','')===rel)&&!rel.startsWith('audio/')&&event.request.mode!=='navigate')return;
 event.respondWith((async()=>{if(rel.startsWith('audio/')){const c=await caches.open(AUDIO),hit=await c.match(event.request,{ignoreSearch:true});if(hit)return hit;return fetch(event.request);}
 const c=await caches.open(SHELL);if(event.request.mode==='navigate'){try{const r=await fetch(event.request);if(r.ok&&new URL(r.url).origin===base.origin)return r;return await c.match('./index.html')||r;}catch{return await c.match('./index.html')||Response.error();}}
 return await c.match(event.request,{ignoreSearch:true})||fetch(event.request);
 })());});
