// 網路優先：有網路就向伺服器確認最新版（cache: no-cache），沒網路才用快取（離線可練）。程式同英文站。
const CACHE = "soc8-20261011185311";
const FILES = ["./", "index.html", "hist1.html", "hist2.html", "socexam.html", "manifest.json", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, {cache: "reload"}))))); });
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) return;
  // 🔴 navigate 類請求不能直接加 RequestInit（會丟錯而退回舊快取），改用網址重新發一個 no-cache 請求
  e.respondWith(fetch(e.request.url, {cache: "no-cache"}).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
