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
exports.CommentsController = void 0;
const common_1 = require("@nestjs/common");
const comments_service_1 = require("./comments.service");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const access_token_guard_1 = require("../users/guards/access-token.guard");
const user_verify_guard_1 = require("../users/guards/user-verify.guard");
let CommentsController = class CommentsController {
    constructor(commentService) {
        this.commentService = commentService;
    }
    async createComment(comment, req, res) {
        const userId = req.accessToken?.userId;
        console.log("check userId ", userId);
        const result = await this.commentService.createComment({
            userId,
            content: comment.content,
            userRootId: comment.userRootId,
            postRootId: comment.postRootId,
            parentId: comment.parentId,
        });
        return res.status(200).json({
            message: "Create new comment successfully!",
            result,
        });
    }
    async getComment(postRootId, startRootId, res) {
        const result = await this.commentService.getComment({
            postRootId: postRootId,
            startRootId: startRootId,
        });
        return res.status(200).json({
            message: "get comment successfully!",
            result,
        });
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, user_verify_guard_1.UserVerifyGuard),
    (0, common_1.Post)("create-comment"),
    __param(0, (0, common_1.Body)("comment")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_comment_dto_1.CreateCommentDto, Object, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "createComment", null);
__decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, user_verify_guard_1.UserVerifyGuard),
    (0, common_1.Get)("get-comment/:postRootId/:startRootId"),
    __param(0, (0, common_1.Param)("postRootId")),
    __param(1, (0, common_1.Param)("startRootId")),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "getComment", null);
exports.CommentsController = CommentsController = __decorate([
    (0, common_1.Controller)("comments"),
    __metadata("design:paramtypes", [comments_service_1.CommentsService])
], CommentsController);
//# sourceMappingURL=comments.controller.js.map