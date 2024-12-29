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
exports.MediaService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
let MediaService = class MediaService {
    constructor(configService, mediaQueue) {
        this.configService = configService;
        this.mediaQueue = mediaQueue;
        this.bucketName = this.configService.get("S3_BUCKET_NAME");
        const s3_region = this.configService.get("S3_REGION");
        if (!s3_region) {
            throw new Error("S3_REGION not found in environment variables");
        }
        this.client = new client_s3_1.S3Client({
            region: s3_region,
            credentials: {
                accessKeyId: this.configService.get("S3_ACCESS_KEY"),
                secretAccessKey: this.configService.get("S3_SECRET_ACCESS_KEY"),
            },
            forcePathStyle: true,
        });
    }
    async uploadSinglePhoto({ userId, fileMap, isPublic = true, }) {
        const file = fileMap.get(userId)[0];
        try {
            const key = `${(0, uuid_1.v4)()}`;
            const command = new client_s3_1.PutObjectCommand({
                Bucket: this.bucketName,
                Key: `${key}-${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype,
                Metadata: {
                    originalName: file.originalname,
                },
            });
            const uploadResult = await this.client.send(command);
            const url = `https://${this.bucketName}.s3.${this.configService.get("S3_REGION")}.amazonaws.com/${key}-${file.originalname}`;
            fileMap.delete(userId);
            return url;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error);
        }
    }
    async uploadMultiPhoto({ userId, fileMap, isPublic = true, }) {
        const files = fileMap.get(userId) || [];
        const result = [];
        try {
            for (const file of files) {
                const key = `${(0, uuid_1.v4)()}-${file.originalname}`;
                const command = new client_s3_1.PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: key,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                    Metadata: {
                        originalName: file.originalname,
                    },
                });
                await this.client.send(command);
                const encodedKey = encodeURIComponent(key);
                const url = `https://${this.bucketName}.s3.${this.configService.get("S3_REGION")}.amazonaws.com/${encodedKey}`;
                result.push({
                    type: file.mimetype.split("/")[0],
                    url: url,
                });
            }
            fileMap.delete(userId);
            return result;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async getVideo() { }
    async uploadVideo({ userId, fileMap, }) {
        const file = fileMap.get(userId)[0];
        try {
            const key = `${(0, uuid_1.v4)()}`;
            const command = new client_s3_1.PutObjectCommand({
                Bucket: this.bucketName,
                Key: `${key}-${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype,
                Metadata: {
                    originalName: file.originalname,
                },
            });
            const url = `https://${this.bucketName}.s3.${this.configService.get("S3_REGION")}.amazonaws.com/${key}-${file.originalname}`;
            console.log("url ", url);
            fileMap.delete(userId);
            return url;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error);
        }
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)("mediaQueue")),
    __metadata("design:paramtypes", [config_1.ConfigService,
        bullmq_2.Queue])
], MediaService);
//# sourceMappingURL=media.service.js.map