"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertImagePipe = void 0;
const common_1 = require("@nestjs/common");
const sharp = require("sharp");
const media_enum_1 = require("../../../constants/media.enum");
let ConvertImagePipe = class ConvertImagePipe {
    async transform(file, metadata) {
        if (!file || !file.buffer) {
            throw new common_1.BadRequestException("Invalid file input.");
        }
        try {
            if (file.mimetype === media_enum_1.PhotoMimeType.png) {
                const convertedBuffer = await sharp(file.buffer)
                    .jpeg({ quality: 70 })
                    .toBuffer();
                file.buffer = convertedBuffer;
                file.mimetype = "image/jpeg";
                file.originalname = file.originalname.replace(/\.[^.]+$/, ".jpg");
                file.size = convertedBuffer.length;
            }
            return file;
        }
        catch (error) {
            throw new common_1.BadRequestException("Error converting image format");
        }
    }
};
exports.ConvertImagePipe = ConvertImagePipe;
exports.ConvertImagePipe = ConvertImagePipe = __decorate([
    (0, common_1.Injectable)()
], ConvertImagePipe);
//# sourceMappingURL=convert-mime-file.pipe.js.map