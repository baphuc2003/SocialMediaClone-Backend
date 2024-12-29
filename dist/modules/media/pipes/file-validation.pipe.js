"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const media_enum_1 = require("../../../constants/media.enum");
let FileValidationPipe = class FileValidationPipe {
    transform(value, metadata) {
        if (!value) {
            throw new common_1.BadRequestException("File isn't empty!");
        }
        const oneKb = 3 * 1024 * 1024;
        if (value?.size > oneKb) {
            throw new common_1.BadRequestException("File size is large!");
        }
        if (!Object.values(media_enum_1.PhotoMimeType).includes(value?.mimetype)) {
            throw new common_1.BadRequestException("Invalid image format. Only JPEG, PNG, and GIF are allowed.");
        }
        return value;
    }
};
exports.FileValidationPipe = FileValidationPipe;
exports.FileValidationPipe = FileValidationPipe = __decorate([
    (0, common_1.Injectable)()
], FileValidationPipe);
//# sourceMappingURL=file-validation.pipe.js.map