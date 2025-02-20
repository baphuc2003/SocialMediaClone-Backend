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
exports.ConversationController = void 0;
const common_1 = require("@nestjs/common");
const access_token_guard_1 = require("../users/guards/access-token.guard");
const user_verify_guard_1 = require("../users/guards/user-verify.guard");
const conversation_service_1 = require("./conversation.service");
let ConversationController = class ConversationController {
    constructor(conversationService) {
        this.conversationService = conversationService;
    }
    async getSingleConversation(req, receiverId, res) {
        const userId = req.accessToken?.userId;
        console.log("check 35 ", receiverId);
        const result = await this.conversationService.getSingleConversation({
            senderId: userId,
            receiverId: receiverId,
        });
        return res.status(200).json({
            message: "Get single conversation successfully!",
            data: result,
        });
    }
};
exports.ConversationController = ConversationController;
__decorate([
    (0, common_1.Get)("get-single-conversation/receiver/:receiverId"),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, user_verify_guard_1.UserVerifyGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("receiverId")),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "getSingleConversation", null);
exports.ConversationController = ConversationController = __decorate([
    (0, common_1.Controller)("conversation"),
    __metadata("design:paramtypes", [conversation_service_1.ConversationService])
], ConversationController);
//# sourceMappingURL=conversation.controller.js.map