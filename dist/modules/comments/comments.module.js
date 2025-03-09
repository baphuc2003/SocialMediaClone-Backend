"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsModule = void 0;
const common_1 = require("@nestjs/common");
const comments_controller_1 = require("./comments.controller");
const comments_service_1 = require("./comments.service");
const mongoose_1 = require("@nestjs/mongoose");
const comment_schema_1 = require("./schemas/comment.schema");
const users_module_1 = require("../users/users.module");
const public_key_module_1 = require("../public-key/public-key.module");
const graph_comment_schema_1 = require("./schemas/graph-comment.schema");
const bull_1 = require("@nestjs/bull");
const comment_processor_1 = require("./processor/comment.processor");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("../users/entities/users.entity");
let CommentsModule = class CommentsModule {
};
exports.CommentsModule = CommentsModule;
exports.CommentsModule = CommentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: comment_schema_1.Comment.name, schema: comment_schema_1.CommentSchema },
                { name: "Graph_Comment", schema: graph_comment_schema_1.GraphCommentSchema },
            ]),
            typeorm_1.TypeOrmModule.forFeature([users_entity_1.UserEntity]),
            bull_1.BullModule.registerQueue({
                name: "commentQueue",
            }),
            users_module_1.UsersModule,
            public_key_module_1.PublicKeyModule,
        ],
        controllers: [comments_controller_1.CommentsController],
        providers: [comments_service_1.CommentsService, comment_processor_1.CommentProcessor],
        exports: [bull_1.BullModule],
    })
], CommentsModule);
//# sourceMappingURL=comments.module.js.map