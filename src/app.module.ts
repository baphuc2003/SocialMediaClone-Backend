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
import { SocketModule } from './modules/socket/socket.module';
import { ConversationModule } from './modules/conversation/conversation.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3307,
      username: "phuc",
      password: "secret",
      database: "test",
      synchronize: true,
      autoLoadEntities: true,
    }),

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
  ],
  controllers: [AppController, UsersController, PostsController],
  providers: [AppService],
})
export class AppModule {}
