const staticCacheName = 'site-static-v1';
const dynamicCache = 'site-dynamic-v1';
const assets = [
  '/njpwa/',
  '/njpwa/index.html',
  '/njpwa/js/app.js',
  '/njpwa/js/ui.js',
  '/njpwa/js/materialize.min.js',
  '/njpwa/css/styles.css',
  '/njpwa/css/materialize.min.css',
  '/njpwa/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  '/njpwa/pages/fallback.html',
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install sw
self.addEventListener('install', (e) => {
  //   console.log('sw has been installed.');
  e.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching all assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', (e) => {
  //   console.log('sw has been activated.');
  e.waitUntil(
    caches.keys().then((keys) => {
      //   console.log(keys);
      return Promise.all(
        keys.filter((key) => key !== staticCacheName && key !== dynamicCache).map((key) => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener('fetch', (e) => {
  //   console.log('fetch event', e);
  e.respondWith(
    caches
      .match(e.request)
      .then((cacheRes) => {
        return (
          cacheRes ||
          fetch(e.request).then((fetchRes) => {
            return caches.open(dynamicCache).then((cache) => {
              cache.put(e.request.url, fetchRes.clone());
              limitCacheSize(dynamicCache, 15);
              return fetchRes;
            });
          })
        );
      })
      .catch(() => {
        if (e.request.url.indexOf('.html') > -1) {
          return caches.match('/njpwa/pages/fallback.html');
        }
      })
  );
});
