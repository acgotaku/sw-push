/* eslint-disable no-console */
import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', function () {
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting();

  // Perform any other actions required for your
  // service worker to install, potentially inside
  // of event.waitUntil();
});

self.addEventListener('notificationclose', function (e) {
  const notification = e.notification;
  const primaryKey = notification.data.primaryKey;

  console.log('Closed notification: ' + primaryKey);
});

self.addEventListener('notificationclick', function (e) {
  const notification = e.notification;
  const action = e.action;

  if (action === 'close') {
    notification.close();
  } else {
    // clients.openWindow('http://www.example.com');
    notification.close();
  }
});

self.addEventListener('push', function (e) {
  let body;

  if (e.data) {
    body = e.data.text();
  } else {
    body = 'Push message no payload';
  }

  const options = {
    body: body,
    icon: 'images/notification-flat.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore this new world',
        icon: 'images/checkmark.png'
      },
      {
        action: 'close',
        title: "I don't want any of this",
        icon: 'images/xmark.png'
      }
    ]
  };
  e.waitUntil(self.registration.showNotification('Push Notification', options));
});
