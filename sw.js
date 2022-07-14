// install sw
self.addEventListener('install', (e) => {
  console.log('sw has been installed.');
});

// activate event
self.addEventListener('activate', (e) => {
  console.log('sw has been activated.');
});

// fetch event
self.addEventListener('fetch', (e) => {
  console.log('fetch event', e);
});
