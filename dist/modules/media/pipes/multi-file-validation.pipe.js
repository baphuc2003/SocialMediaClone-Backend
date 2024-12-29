"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiFileValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const media_enum_1 = require("../../../constants/media.enum");
let MultiFileValidationPipe = class MultiFileValidationPipe {
    transform(file, metadata) {
        if (!file) {
            throw new common_1.BadRequestException("File isn't empty!");
        }
        if (file.length > 5) {
            throw new common_1.BadRequestException("The maximum number of files is 4");
        }
        const oneKb = 3 * 1024 * 1024;
        for (let i = 0; i < file.length; i++) {
            if (file[i].size > oneKb) {
                throw new common_1.BadRequestException("File size is large!");
            }
        }
        const arrPhotoMimeType = Object.values(media_enum_1.PhotoMimeType);
        file.map((f) => {
            if (!arrPhotoMimeType.includes(f.mimetype)) {
                throw new common_1.BadRequestException("Invalid image format. Only JPEG, PNG, and GIF are allowed.");
            }
        });
        return file;
    }
};
exports.MultiFileValidationPipe = MultiFileValidationPipe;
exports.MultiFileValidationPipe = MultiFileValidationPipe = __decorate([
    (0, common_1.Injectable)()
], MultiFileValidationPipe);
//# sourceMappingURL=multi-file-validation.pipe.js.map