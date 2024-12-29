"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const file_validation_pipe_1 = require("./pipes/file-validation.pipe");
const convert_mime_file_pipe_1 = require("./pipes/convert-mime-file.pipe");
const access_token_guard_1 = require("../users/guards/access-token.guard");
const user_verify_guard_1 = require("../users/guards/user-verify.guard");
const file_map_1 = require("./data-structures/file-map");
const media_service_1 = require("./media.service");
const multi_file_validation_pipe_1 = require("./pipes/multi-file-validation.pipe");
const convert_multi_mime_file_pipe_1 = require("./pipes/convert-multi-mime-file.pipe");
const fs = require("fs");
const path = require("path");
const video_validation_pipe_1 = require("./pipes/video-validation.pipe");
let MediaController = class MediaController {
    constructor(mediaService) {
        this.mediaService = mediaService;
    }
    async uploadImage(file, req, res) {
        const userId = req.user?.id;
        (0, file_map_1.addFileToMap)(userId, file);
        const result = await this.mediaService.uploadSinglePhoto({
            userId: userId,
            fileMap: file_map_1.fileMap,
        });
        return res.status(201).json({
            message: "Upload single image successfully!",
            data: {
                image: result,
            },
        });
    }
    async uploadMultiImage(files, req, res) {
        const userId = req.user?.id;
        files.map((file) => {
            (0, file_map_1.addFileToMap)(userId, file);
        });
        const result = await this.mediaService.uploadMultiPhoto({
            userId: userId,
            fileMap: file_map_1.fileMap,
        });
        return res.status(201).json({
            message: "Upload single image successfully!",
            data: {
                image: result,
            },
        });
    }
    async getVideo(video, req, res) {
        const videoPath = path.resolve("uploads", "demo.mp4");
        const { size } = fs.statSync(videoPath);
        const chunkSize = 10 ** 6;
        const range = req.headers.range;
        console.log("Range từ browser:", range);
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1]
                ? Math.min(parseInt(parts[1], 10), size - 1)
                : Math.min(start + chunkSize, size - 1);
            console.log(`Start: ${start}, End: ${end}, ChunkSize: ${chunkSize}`);
            const readStreamfile = fs.createReadStream(videoPath, {
                start,
                end,
                highWaterMark: 60 * 1024,
            });
            res.writeHead(206, {
                "Content-Range": `bytes ${start}-${end}/${size}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunkSize,
                "Content-Type": "video/mp4",
            });
            readStreamfile.pipe(res);
        }
        else {
            const head = {
                "Content-Length": size,
            };
            res.writeHead(common_1.HttpStatus.OK, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    }
    async uploadVideo(video, req, res) {
        const userId = req.user?.id;
        (0, file_map_1.addFileToMap)(userId, video);
        const result = await this.mediaService.uploadVideo({
            userId: userId,
            fileMap: file_map_1.fileMap,
        });
        return res.status(201).json({
            message: "Upload video successfully!",
            data: {
                video: {
                    result,
                },
            },
        });
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, common_1.Post)("upload-image"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, user_verify_guard_1.UserVerifyGuard),
    __param(0, (0, common_1.UploadedFile)(new file_validation_pipe_1.FileValidationPipe(), new convert_mime_file_pipe_1.ConvertImagePipe())),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)("upload-multi-image"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("files")),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, user_verify_guard_1.UserVerifyGuard),
    __param(0, (0, common_1.UploadedFiles)(new multi_file_validation_pipe_1.MultiFileValidationPipe(), new convert_multi_mime_file_pipe_1.ConvertMultiImagePipe())),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadMultiImage", null);
__decorate([
    (0, common_1.Get)("get-video"),
    (0, common_1.Header)("Accept-Ranges", "bytes"),
    (0, common_1.Header)("Content-Type", "video/mp4"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("video")),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getVideo", null);
__decorate([
    (0, common_1.Post)("upload-video"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("video")),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, user_verify_guard_1.UserVerifyGuard),
    __param(0, (0, common_1.UploadedFile)(new video_validation_pipe_1.VideoValidationPipe())),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadVideo", null);
exports.MediaController = MediaController = __decorate([
    (0, common_1.Controller)("media"),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], MediaController);
//# sourceMappingURL=media.controller.js.map