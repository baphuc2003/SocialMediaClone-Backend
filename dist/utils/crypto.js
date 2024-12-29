"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKeyToken = generateKeyToken;
const crypto_1 = require("crypto");
async function generateKeyToken() {
    const result = new Promise((resolve, reject) => {
        return (0, crypto_1.generateKeyPair)('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            },
        }, (err, publicKey, privateKey) => {
            if (err)
                return reject(err);
            return resolve({
                publicKey,
                privateKey,
            });
        });
    });
    return result;
}
//# sourceMappingURL=crypto.js.map