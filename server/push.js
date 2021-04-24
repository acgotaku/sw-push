'use strict';

const webpush = require('web-push');

// VAPID keys should only be generated only once.
// const vapidKeys = webpush.generateVAPIDKeys();
// console.log(vapidKeys)

const vapidPublicKey = 'public key';

const vapidPrivateKey = 'private key';

// PushSubscriptionJSON Info
const pushSubscription = {
  endpoint: '',
  expirationTime: null,
  keys: {
    p256dh: '',
    auth: ''
  }
};

const payload = 'hello world!';

const options = {
  vapidDetails: {
    subject: 'mailto:example@web-push-node.org',
    publicKey: vapidPublicKey,
    privateKey: vapidPrivateKey
  },
  TTL: 60
};
webpush
  .sendNotification(pushSubscription, payload, options)
  .then(function (result) {
    console.log('success!');
    console.log(result);
  })
  .catch(function (err) {
    console.log('fail!');
    console.error(err);
  });
