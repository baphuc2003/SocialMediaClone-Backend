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
exports.PostProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const file_map_1 = require("../../media/data-structures/file-map");
const media_service_1 = require("../../media/media.service");
const post_entity_1 = require("../entities/post.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let PostProcessor = class PostProcessor {
    constructor(mediaService, postRepository) {
        this.mediaService = mediaService;
        this.postRepository = postRepository;
    }
    async handleCreatePost(job) {
        const userId = job.data?.userId;
        const post = job.data.post;
        const result = (await this.mediaService.uploadMultiPhoto({
            userId: userId,
            fileMap: file_map_1.fileMap,
        }));
        post.mediaUrls = result;
        post.created_at = new Date();
        await this.postRepository.save(post);
        return post;
    }
};
exports.PostProcessor = PostProcessor;
__decorate([
    (0, bull_1.Process)("create-post"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostProcessor.prototype, "handleCreatePost", null);
exports.PostProcessor = PostProcessor = __decorate([
    (0, bull_1.Processor)("postQueue"),
    __param(1, (0, typeorm_1.InjectRepository)(post_entity_1.PostEntity)),
    __metadata("design:paramtypes", [media_service_1.MediaService,
        typeorm_2.Repository])
], PostProcessor);
//# sourceMappingURL=post.processor.js.map