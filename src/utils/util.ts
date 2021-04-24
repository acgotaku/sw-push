interface KeyPair {
  publicKey: string;
  privateKey: string;
}

function base64UrlToUint8Array(base64UrlData: string): Uint8Array {
  const padding = '='.repeat((4 - (base64UrlData.length % 4)) % 4);
  const base64 = (base64UrlData + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const buffer = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    buffer[i] = rawData.charCodeAt(i);
  }
  return buffer;
}

function uint8ArrayToBase64Url(
  uint8Array: Uint8Array,
  start?: number,
  end?: number
): string {
  start = start || 0;
  end = end || uint8Array.byteLength;

  const base64 = window.btoa(
    String.fromCharCode.apply(null, Array.from(uint8Array.subarray(start, end)))
  );
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function cryptoKeyToUrlBase64(publicKey: CryptoKey, privateKey: CryptoKey) {
  const promises = [];
  promises.push(
    crypto.subtle.exportKey('jwk', publicKey).then(jwk => {
      const x = base64UrlToUint8Array(jwk.x!);
      const y = base64UrlToUint8Array(jwk.y!);

      const publicKey = new Uint8Array(65);
      publicKey.set([0x04], 0);
      publicKey.set(x, 1);
      publicKey.set(y, 33);

      return publicKey;
    })
  );

  promises.push(
    crypto.subtle.exportKey('jwk', privateKey).then(jwk => {
      return base64UrlToUint8Array(jwk.d!);
    })
  );

  return Promise.all(promises).then(exportedKeys => {
    return {
      publicKey: uint8ArrayToBase64Url(exportedKeys[0]),
      privateKey: uint8ArrayToBase64Url(exportedKeys[1])
    };
  });
}

function generateNewKeys(): Promise<KeyPair> {
  return crypto.subtle
    .generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits'])
    .then(keys => {
      return cryptoKeyToUrlBase64(keys.publicKey, keys.privateKey);
    });
}

export { base64UrlToUint8Array, uint8ArrayToBase64Url, generateNewKeys };
