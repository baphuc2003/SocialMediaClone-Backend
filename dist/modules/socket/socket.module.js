"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketModule = void 0;
const common_1 = require("@nestjs/common");
const notification_gateway_1 = require("./gateways/notification.gateway");
const socket_controller_1 = require("./socket.controller");
const users_module_1 = require("../users/users.module");
const public_key_module_1 = require("../public-key/public-key.module");
const single_conversation_entity_1 = require("./entities/single-conversation.entity");
const typeorm_1 = require("@nestjs/typeorm");
const socket_service_1 = require("./socket.service");
let SocketModule = class SocketModule {
};
exports.SocketModule = SocketModule;
exports.SocketModule = SocketModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            public_key_module_1.PublicKeyModule,
            typeorm_1.TypeOrmModule.forFeature([single_conversation_entity_1.SingleConversationEntity]),
        ],
        providers: [notification_gateway_1.NotificationGateway, socket_service_1.SocketService],
        controllers: [socket_controller_1.SocketController],
    })
], SocketModule);
//# sourceMappingURL=socket.module.js.map