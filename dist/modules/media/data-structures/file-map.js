"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileFromMap = exports.getFilesFromMap = exports.addFileToMap = exports.fileMap = void 0;
exports.fileMap = new Map();
const addFileToMap = (userId, fileData) => {
    if (!exports.fileMap.has(userId)) {
        exports.fileMap.set(userId, []);
    }
    exports.fileMap.get(userId)?.push(fileData);
};
exports.addFileToMap = addFileToMap;
const getFilesFromMap = (userId) => {
    return exports.fileMap.get(userId) || [];
};
exports.getFilesFromMap = getFilesFromMap;
const deleteFileFromMap = (userId, index) => {
    const userFiles = exports.fileMap.get(userId);
    if (userFiles && userFiles.length > index) {
        userFiles.splice(index, 1);
        if (userFiles.length === 0) {
            exports.fileMap.delete(userId);
        }
    }
};
exports.deleteFileFromMap = deleteFileFromMap;
//# sourceMappingURL=file-map.js.map