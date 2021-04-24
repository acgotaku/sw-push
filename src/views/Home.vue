<template>
  <div :class="$style.container">
    <div :class="$style.home">
      <h1>Service Worker Push Notifications Demo</h1>
      <p :class="$style.notif" v-show="!isGranted">
        Please allow show notifications.
      </p>
      <div :class="$style.keys" v-show="showKeys">
        <div :class="$style.key">
          <p><strong>Public Key</strong></p>
          <p :class="$style.code">
            {{ vapidPublicKey }}
          </p>
        </div>
        <div :class="$style.key">
          <p><strong>Private Key</strong></p>
          <p :class="$style.code">
            {{ vapidPrivateKey }}
          </p>
        </div>
      </div>

      <div :class="$style.auth" v-show="subJSON">
        <p :class="$style.authTitle">
          <strong> PushSubscriptionJSON Info</strong>
        </p>
        <p :class="$style.authCode">
          {{ subJSON }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { generateNewKeys } from '@/utils/util';

interface PushSubscriptionJSON {
  endpoint?: string;
  expirationTime?: number | null;
  keys?: Record<string, string>;
}

@Component
export default class Home extends Vue {
  status = '';
  vapidPublicKey = localStorage.getItem('vapidPublicKey') || '';
  vapidPrivateKey = localStorage.getItem('vapidPrivateKey') || '';
  subJSON: PushSubscriptionJSON | null = null;

  @Watch('isGranted', { immediate: true })
  onPermissionChanged(): void {
    if (this.isGranted) {
      this.newKeys();
    }
  }

  get isGranted(): boolean {
    return this.status === 'granted';
  }

  get showKeys(): boolean {
    return this.vapidPublicKey.length > 0;
  }

  created(): void {
    Notification.requestPermission(status => {
      this.status = status;
    });
  }

  newKeys(): void {
    if (this.showKeys) {
      this.subscribeNotif();
    } else {
      generateNewKeys()
        .then(keys => {
          const { publicKey, privateKey } = keys;
          localStorage.setItem('vapidPublicKey', publicKey);
          localStorage.setItem('vapidPrivateKey', privateKey);
          this.vapidPublicKey = publicKey;
          this.vapidPrivateKey = privateKey;
        })
        .then(() => {
          this.subscribeNotif();
        });
    }
  }

  subscribeNotif(): void {
    navigator.serviceWorker.ready
      .then(registration => {
        return registration.pushManager.getSubscription().then(subscription => {
          if (subscription === null) {
            return registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: this.vapidPublicKey
            });
          } else {
            return subscription;
          }
        });
      })
      .then(subscription => {
        this.subJSON = subscription.toJSON();
      });
  }
}
</script>
<style lang="postcss" module>
.container {
  max-width: 860px;
  margin: 0 auto;
  padding: 24px;
}

.home {
  padding: 8px 24px;
  background-color: var(--color-container);
}

.notif {
  margin: 24px 0;
  color: var(--color-warning);
}

.keys {
  margin: 24px 0;
  font-size: 16px;
}

.key {
  margin: 16px 0;
}

.code {
  font-size: 14px;
  white-space: nowrap;
}

.auth {
  margin: 24px 0;

  &Code {
    white-space: pre;
    overflow: auto;
  }
}
</style>
