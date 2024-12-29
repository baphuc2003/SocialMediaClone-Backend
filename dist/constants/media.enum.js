"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoMimeType = exports.PhotoMimeType = exports.Media = void 0;
var Media;
(function (Media) {
    Media["Photo"] = "Photo";
    Media["Video"] = "Video";
})(Media || (exports.Media = Media = {}));
var PhotoMimeType;
(function (PhotoMimeType) {
    PhotoMimeType["jpeg"] = "image/jpeg";
    PhotoMimeType["png"] = "image/png";
    PhotoMimeType["gif"] = "image/gif";
})(PhotoMimeType || (exports.PhotoMimeType = PhotoMimeType = {}));
var VideoMimeType;
(function (VideoMimeType) {
    VideoMimeType["mp4"] = "video/mp4";
})(VideoMimeType || (exports.VideoMimeType = VideoMimeType = {}));
//# sourceMappingURL=media.enum.js.map