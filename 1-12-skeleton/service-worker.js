var cacheName = 'Weather-v1';
var dataCacheName = 'Weather-data';

var weatherAPIUrlBase = 'https://publicdata-weather.firebaseio.com/';

var filesToCache = [
  '/index.html',
  '/favicon.ico',
  '/bower_components/localforage/dist/localforage.min.js',
  '/images/clear.png',
  '/images/cloudy-scattered-showers.png',
  '/images/cloudy.png',
  '/images/cloudy_s_sunny.png',
  '/images/fog.png',
  '/images/ic_add_white_24px.svg',
  '/images/ic_refresh_white_24px.svg',
  '/images/icons',
  '/images/partly-cloudy.png',
  '/images/rain.png',
  '/images/scattered-showers.png',
  '/images/sleet.png',
  '/images/snow.png',
  '/images/thunderstorm.png',
  '/images/wind.png',
  '/images/icons/apple-120.png',
  '/images/icons/apple-152.png',
  '/images/icons/apple-167.png',
  '/images/icons/apple-180.png',
  '/images/icons/apple-60.png',
  '/images/icons/apple-76.png',
  '/images/icons/icon-128x128.png',
  '/images/icons/icon-144x144.png',
  '/images/icons/icon-152x152.png',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-256x256.png',
  '/images/icons/icon-384x384.png',
  '/images/icons/icon-48x48.png',
  '/images/icons/icon-512x512.png',
  '/images/icons/icon-96x96.png',
  '/styles/ud811.css',
  '/scripts/app.js',
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] fetch', e.request.url);
  if (e.request.url.startsWith(weatherAPIUrlBase)) {
    e.respondWith(
      fetch(e.request).then(function(response) {
        return caches.open(dataCacheName).then(function(cache) {
          cache.put(e.request.url, response.clone());
          console.log('[ServiceWorker] fetched & cached');
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});
