"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const media_enum_1 = require("../../../constants/media.enum");
let VideoValidationPipe = class VideoValidationPipe {
    transform(file, metadata) {
        if (!file) {
            throw new common_1.BadRequestException("File isn't empty!");
        }
        const { mimetype, size } = file;
        console.log("check file ", file);
        if (!Object.values(media_enum_1.VideoMimeType).includes(mimetype)) {
            throw new common_1.BadRequestException("Invalid video format. Only mp4 are allowed.");
        }
        const maxSizeVideo = 100 * 1024 * 1024;
        if (size > maxSizeVideo) {
            throw new common_1.BadRequestException("File size is large!");
        }
        return file;
    }
};
exports.VideoValidationPipe = VideoValidationPipe;
exports.VideoValidationPipe = VideoValidationPipe = __decorate([
    (0, common_1.Injectable)()
], VideoValidationPipe);
//# sourceMappingURL=video-validation.pipe.js.map