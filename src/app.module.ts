import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersController } from "./modules/users/users.controller";
import { UsersModule } from "./modules/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailerModule } from "@nestjs-modules/mailer";
import { MailModule } from "./modules/mail/mail.module";
import { PublicKeyModule } from "./modules/public-key/public-key.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { RabbitMQModule } from "./modules/rabbitMq/rabbitmq.module";
import { BullModule } from "@nestjs/bullmq";
import { MediaModule } from "./modules/media/media.module";
import { ConfigModule } from "@nestjs/config";
import { PostsController } from "./modules/posts/posts.controller";
import { PostsModule } from "./modules/posts/posts.module";
import { SocketModule } from "./modules/socket/socket.module";
import { ConversationModule } from "./modules/conversation/conversation.module";
import { CacheModule } from "@nestjs/cache-manager";
import { CommentsModule } from "./modules/comments/comments.module";
import { MongooseModule } from "@nestjs/mongoose";
import {
  Comment,
  CommentSchema,
} from "./modules/comments/schemas/comment.schema";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "@314159Phuc",
      database: "demo",
      synchronize: true,
      autoLoadEntities: true,
    }),
    MongooseModule.forRoot("mongodb://localhost/nest"),

    UsersModule,
    MailModule,
    BullModule.forRoot({
      connection: {
        host: "localhost",
        port: 6379,
      },
    }),
    PublicKeyModule,
    AuthModule,
    RabbitMQModule,
    MediaModule,
    ConfigModule.forRoot(),
    PostsModule,
    SocketModule,
    ConversationModule,
    CommentsModule,
  ],
  controllers: [AppController, UsersController, PostsController],
  providers: [AppService],
})
export class AppModule {}
