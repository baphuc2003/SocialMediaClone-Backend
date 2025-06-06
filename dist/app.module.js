"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_controller_1 = require("./modules/users/users.controller");
const users_module_1 = require("./modules/users/users.module");
const typeorm_1 = require("@nestjs/typeorm");
const mail_module_1 = require("./modules/mail/mail.module");
const public_key_module_1 = require("./modules/public-key/public-key.module");
const auth_module_1 = require("./modules/auth/auth.module");
const rabbitmq_module_1 = require("./modules/rabbitMq/rabbitmq.module");
const bullmq_1 = require("@nestjs/bullmq");
const media_module_1 = require("./modules/media/media.module");
const config_1 = require("@nestjs/config");
const posts_controller_1 = require("./modules/posts/posts.controller");
const posts_module_1 = require("./modules/posts/posts.module");
const socket_module_1 = require("./modules/socket/socket.module");
const conversation_module_1 = require("./modules/conversation/conversation.module");
const comments_module_1 = require("./modules/comments/comments.module");
const mongoose_1 = require("@nestjs/mongoose");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    console.log("DATABASE_HOST:", configService.get("DATABASE_HOST"));
                    console.log("DATABASE_PORT:", configService.get("DATABASE_PORT"));
                    return {
                        type: "mysql",
                        host: configService.get("DATABASE_HOST") || "localhost",
                        port: +configService.get("DATABASE_PORT") || 3306,
                        username: configService.get("DATABASE_USERNAME") || "root",
                        password: configService.get("DATABASE_PASSWORD") || "@314159Phuc",
                        database: configService.get("DATABASE_NAME") || "demo",
                        synchronize: true,
                        autoLoadEntities: true,
                    };
                },
                inject: [config_1.ConfigService],
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    console.log("MONGO_HOST:", configService.get("MONGO_HOST"));
                    console.log("MONGO_PORT:", configService.get("MONGO_PORT"));
                    console.log("MONGO_DATABASE:", configService.get("MONGO_DATABASE"));
                    return {
                        uri: `mongodb://${configService.get("MONGO_HOST") || "localhost"}:${configService.get("MONGO_PORT") || 27017}/${configService.get("MONGO_DATABASE") || "nest"}`,
                    };
                },
                inject: [config_1.ConfigService],
            }),
            users_module_1.UsersModule,
            mail_module_1.MailModule,
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    connection: {
                        host: configService.get("REDIS_HOST") || "localhost",
                        port: +configService.get("REDIS_PORT") || 6379,
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            public_key_module_1.PublicKeyModule,
            auth_module_1.AuthModule,
            rabbitmq_module_1.RabbitMQModule,
            media_module_1.MediaModule,
            config_1.ConfigModule.forRoot(),
            posts_module_1.PostsModule,
            socket_module_1.SocketModule,
            conversation_module_1.ConversationModule,
            comments_module_1.CommentsModule,
        ],
        controllers: [app_controller_1.AppController, users_controller_1.UsersController, posts_controller_1.PostsController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map