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
exports.PostsController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const post_entity_1 = require("./entities/post.entity");
const typeorm_2 = require("typeorm");
const hashtag_entity_1 = require("./entities/hashtag.entity");
const users_entity_1 = require("../users/entities/users.entity");
const access_token_guard_1 = require("../users/guards/access-token.guard");
const user_verify_guard_1 = require("../users/guards/user-verify.guard");
const create_post_dto_1 = require("./dto/create-post.dto");
const platform_express_1 = require("@nestjs/platform-express");
const form_data_validation_pipe_1 = require("./pipe/form-data-validation.pipe");
const forn_file_validation_pipe_1 = require("./pipe/forn-file-validation.pipe");
const multi_file_validation_pipe_1 = require("../media/pipes/multi-file-validation.pipe");
const convert_multi_mime_file_pipe_1 = require("../media/pipes/convert-multi-mime-file.pipe");
const posts_service_1 = require("./posts.service");
let PostsController = class PostsController {
    constructor(postRepository, userRepository, hashtagRepository, postService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.hashtagRepository = hashtagRepository;
        this.postService = postService;
    }
    async createPost(file, body, req, res) {
        const userId = req.accessToken?.userId;
        const result = await this.postService.addPost({
            req,
            userId,
            post: body,
            files: file,
        });
        return res.status(201).json({
            message: "Create a new post successfully!",
            post: {
                ...result,
            },
        });
    }
    async likePost(postId, req, res) {
        const userId = req.accessToken?.userId;
        const result = await this.postService.likePost({
            postId: postId,
            userId: userId,
        });
        return res.status(201).json({
            message: "Like post successfully!",
            data: result,
        });
    }
    async unlikePost(postId, req, res) {
        const userId = req.accessToken?.userId;
        const result = await this.postService.unlikePost({
            postId: postId,
            userId: userId,
        });
        return res.status(201).json({
            message: "Post unliked successfully!",
            data: result,
        });
    }
    async getFollow(req, res) {
        const userId = req.accessToken?.userId;
        const result = await this.postService.getListFollow(userId);
        return res.status(201).json({
            message: "Get list follow successfully!",
            data: result,
        });
    }
    async getListPost(page, res) {
        const result = await this.postService.listPost(page);
        return res.status(200).json({
            message: "Get list post successfully!",
            data: result,
        });
    }
};
exports.PostsController = PostsController;
__decorate([
    (0, common_1.Post)("create-post"),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, user_verify_guard_1.UserVerifyGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("file")),
    __param(0, (0, common_1.UploadedFiles)(new forn_file_validation_pipe_1.FormFileValidation(), new multi_file_validation_pipe_1.MultiFileValidationPipe(), new convert_multi_mime_file_pipe_1.ConvertMultiImagePipe())),
    __param(1, (0, common_1.Body)(form_data_validation_pipe_1.FormDataValidationPipe)),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, create_post_dto_1.CreatePostDto, Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "createPost", null);
__decorate([
    (0, common_1.Post)("like-post"),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, user_verify_guard_1.UserVerifyGuard),
    __param(0, (0, common_1.Body)("postId")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "likePost", null);
__decorate([
    (0, common_1.Post)("unlike-post"),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, user_verify_guard_1.UserVerifyGuard),
    __param(0, (0, common_1.Body)("postId")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "unlikePost", null);
__decorate([
    (0, common_1.Get)("list-follow"),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, user_verify_guard_1.UserVerifyGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getFollow", null);
__decorate([
    (0, common_1.Get)("get-list-post"),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getListPost", null);
exports.PostsController = PostsController = __decorate([
    (0, common_1.Controller)("post"),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.PostEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(users_entity_1.UserEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(hashtag_entity_1.HashtagEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        posts_service_1.PostsService])
], PostsController);
//# sourceMappingURL=posts.controller.js.map