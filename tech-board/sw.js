/* Tech-Board – Offline-Speicher. Mit Internet wird zuerst die neueste Fassung geladen. */
const CACHE='techboard-v27';
const FILES=["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./apple-touch-icon.png", "./audio/alarm-de.mp3", "./audio/clean-de.mp3", "./audio/alarm-en.mp3", "./audio/alarm-fr.mp3", "./audio/clean-en.mp3", "./audio/clean-fr.mp3", "./ape-holz.jpg", "./ape-metall.jpg"];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n.startsWith('techboard-')&&n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 if(r.mode==='navigate'){e.respondWith((async()=>{const c=await caches.open(CACHE);try{const n=await Promise.race([fetch(r,{cache:'no-store'}),new Promise((_,x)=>setTimeout(()=>x(new Error('timeout')),3000))]);if(n&&n.ok){c.put('./index.html',n.clone());return n}throw new Error('bad')}catch(x){return (await c.match('./index.html'))||Response.error()}})());return}
 e.respondWith(caches.open(CACHE).then(c=>c.match(r)).then(h=>h||fetch(r)))});
