"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const bcrypt = require("bcrypt");
const saltRounds = 10;
function hashPassword(myPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(myPassword, saltRounds, (err, hash) => {
            if (err) {
                return reject(err);
            }
            return resolve(hash);
        });
    });
}
function comparePassword(myPassword, hashPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(myPassword, hashPassword, (err, result) => {
            if (err)
                return reject(err);
            return resolve(result);
        });
    });
}
//# sourceMappingURL=bcrypt.js.map