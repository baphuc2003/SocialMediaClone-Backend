"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsModule = void 0;
const common_1 = require("@nestjs/common");
const posts_service_1 = require("./posts.service");
const posts_controller_1 = require("./posts.controller");
const typeorm_1 = require("@nestjs/typeorm");
const post_entity_1 = require("./entities/post.entity");
const hashtag_entity_1 = require("./entities/hashtag.entity");
const users_module_1 = require("../users/users.module");
const public_key_module_1 = require("../public-key/public-key.module");
const bull_1 = require("@nestjs/bull");
const post_processor_1 = require("./processor/post.processor");
const media_module_1 = require("../media/media.module");
const like_entity_1 = require("./entities/like.entity");
let PostsModule = class PostsModule {
};
exports.PostsModule = PostsModule;
exports.PostsModule = PostsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([post_entity_1.PostEntity, hashtag_entity_1.HashtagEntity, like_entity_1.LikeEntity]),
            users_module_1.UsersModule,
            public_key_module_1.PublicKeyModule,
            media_module_1.MediaModule,
            bull_1.BullModule.registerQueue({
                name: "postQueue",
            }),
        ],
        controllers: [posts_controller_1.PostsController],
        providers: [posts_service_1.PostsService, post_processor_1.PostProcessor],
        exports: [typeorm_1.TypeOrmModule, posts_service_1.PostsService],
    })
], PostsModule);
//# sourceMappingURL=posts.module.js.map