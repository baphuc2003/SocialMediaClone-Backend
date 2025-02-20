"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationModule = void 0;
const common_1 = require("@nestjs/common");
const conversation_controller_1 = require("./conversation.controller");
const conversation_service_1 = require("./conversation.service");
const typeorm_1 = require("@nestjs/typeorm");
const single_conversation_entity_1 = require("../socket/entities/single-conversation.entity");
const public_key_module_1 = require("../public-key/public-key.module");
const users_module_1 = require("../users/users.module");
const cache_manager_1 = require("@nestjs/cache-manager");
let ConversationModule = class ConversationModule {
};
exports.ConversationModule = ConversationModule;
exports.ConversationModule = ConversationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([single_conversation_entity_1.SingleConversationEntity]),
            public_key_module_1.PublicKeyModule,
            users_module_1.UsersModule,
            cache_manager_1.CacheModule.register(),
        ],
        controllers: [conversation_controller_1.ConversationController],
        providers: [conversation_service_1.ConversationService],
    })
], ConversationModule);
//# sourceMappingURL=conversation.module.js.map