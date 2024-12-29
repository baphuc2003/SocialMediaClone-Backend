"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.photoMulterConfig = void 0;
const multer_1 = require("multer");
exports.photoMulterConfig = {
    storage: (0, multer_1.diskStorage)({
        filename: (req, file, cb) => {
            console.log("check file ", file);
            const timestamp = Date.now();
            const originalName = file.originalname.replace(/\s/g, "_");
            cb(null, `${timestamp}-${originalName}`);
        },
    }),
    limits: {
        fileSize: 3 * 1024 * 1024,
    },
};
//# sourceMappingURL=photo-multer.config.js.map