import {
  generateKeyPair,
  generateKeyPairSync,
  KeyPairSyncResult,
} from 'crypto';

export async function generateKeyToken() {
  const result = new Promise<{ publicKey: string; privateKey: string }>(
    (resolve, reject) => {
      return generateKeyPair(
        'rsa',
        {
          modulusLength: 2048, // Độ dài khóa
          publicKeyEncoding: {
            type: 'spki', // Định dạng public key
            format: 'pem', // Định dạng xuất ra
          },
          privateKeyEncoding: {
            type: 'pkcs8', // Định dạng private key
            format: 'pem', // Định dạng xuất ra
          },
        },
        (err, publicKey, privateKey) => {
          if (err) return reject(err);
          return resolve({
            publicKey,
            privateKey,
          });
        },
      );
    },
  );
  return result;
}
