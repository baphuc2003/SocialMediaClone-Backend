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
exports.SocketController = void 0;
const common_1 = require("@nestjs/common");
const notification_gateway_1 = require("./gateways/notification.gateway");
const socket_service_1 = require("./socket.service");
let SocketController = class SocketController {
    constructor(notificationGateway, socketService) {
        this.notificationGateway = notificationGateway;
        this.socketService = socketService;
    }
    async getSingleConversation(req, res) {
        const { senderId, receiverId } = req.body;
        const result = await this.socketService.getSingleConversation({
            senderId: senderId,
            receiverId: receiverId,
        });
        return res.status(200).json({
            message: "Get single conversation successfully!",
            data: result,
        });
    }
};
exports.SocketController = SocketController;
__decorate([
    (0, common_1.Get)("get-single-conversation"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SocketController.prototype, "getSingleConversation", null);
exports.SocketController = SocketController = __decorate([
    (0, common_1.Controller)("socket"),
    __metadata("design:paramtypes", [notification_gateway_1.NotificationGateway,
        socket_service_1.SocketService])
], SocketController);
//# sourceMappingURL=socket.controller.js.map