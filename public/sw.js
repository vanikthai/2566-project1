const cacheName = "v3";
const cacheAsset = ["index.js", "/controls/loadpic.js"];

self.addEventListener("install", (e) => {
  console.log("sw install");
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log("chat file");
        cache.addAll(cacheAsset);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  console.log("activate");
  e.waitUntil(
    caches.keys().then((cacheNam) => {
      return Promise.all(
        cacheNam.map((cach) => {
          console.log(cach, cacheName);
          if (cach !== cacheName) {
            console.log("delete ole catch");
            return caches.delete(cach);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  // console.log("fetching");
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        let resClone = res.clone();
        caches.open(cacheName).then((cache) => {
          // cache.put(e.request, { cache: "no-store" });
        });
        return res || resClone;
      })
      .catch((err) => {
        caches.match(e.request).then((res) => res);
      })
  );
});
