"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.decodedToken = decodedToken;
const jsonwebtoken_1 = require("jsonwebtoken");
const user_enum_1 = require("../constants/user.enum");
const defaultTypeToken = {
    permissions: user_enum_1.Permissions.User,
    created_at: new Date(),
};
function generateToken({ payload, signature, options, }) {
    return new Promise((resolve, reject) => {
        (0, jsonwebtoken_1.sign)({ ...payload, ...defaultTypeToken }, signature, { ...options }, (err, token) => {
            if (err)
                return reject(err);
            return resolve(token);
        });
    });
}
function verifyToken({ token, signature, }) {
    return new Promise((resolve, reject) => {
        try {
            const verifiedToken = (0, jsonwebtoken_1.verify)(token, signature, {
                algorithms: ["RS256"],
            });
            resolve(verifiedToken);
        }
        catch (error) {
            reject(error);
        }
    });
}
async function decodedToken(token) {
    return new Promise((resolve, reject) => {
        try {
            const decodedToken = (0, jsonwebtoken_1.decode)(token);
            resolve(decodedToken);
        }
        catch (error) {
            reject(error);
        }
    });
}
//# sourceMappingURL=jwt.js.map