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
import { ConfigModule, ConfigService } from "@nestjs/config";
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
import { NotificationModule } from './modules/notification/notification.module';
import { ElasticsearchModule } from './modules/elasticsearch/elasticsearch.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
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
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log("MONGO_HOST:", configService.get("MONGO_HOST"));
        console.log("MONGO_PORT:", configService.get("MONGO_PORT"));
        console.log("MONGO_DATABASE:", configService.get("MONGO_DATABASE"));
        return {
          // uri: `mongodb://${configService.get("MONGO_HOST") || "localhost"}:${configService.get("MONGO_PORT") || 27017}/${configService.get("MONGO_DATABASE") || "nest"}`,
          uri: "mongodb+srv://baphuc3112:baphuc3112@cluster0.zgexqph.mongodb.net/nest",
        };
      },
      inject: [ConfigService],
    }),

    UsersModule,
    MailModule,
    // BullModule.forRootAsync({
    //   imports: [ConfigModule],
    //   // useFactory: (configService: ConfigService) => {
    //   //   // console.log("REDIS_HOST:", configService.get("REDIS_HOST"));
    //   //   // console.log("REDIS_USERNAME:", configService.get("REDIS_USERNAME"));
    //   //   // console.log("REDIS_PASSWORD:", configService.get("REDIS_PASSWORD"));
    //   //   // console.log("REDIS_PORT:", configService.get("REDIS_PORT"));
    //   //   return {
    //   //     connection: {
    //   //       // host: configService.get("REDIS_HOST"),
    //   //       // port: configService.get("REDIS_PORT"),
    //   //       // username: configService.get("REDIS_USERNAME"),
    //   //       // password: configService.get("REDIS_PASSWORD"),
    //   //       // tls: {
    //   //       //   // rejectUnauthorized: false,
    //   //       // },
    //   //       // // host: "localhost", // Redis local
    //   //       // // port: 6379,
    //   //       url: "redis://red-cvnthqa4d50c7398vag0:6379",
    //   //     },
    //   //   };
    //   // },
    //   useFactory: (configService: ConfigService) => {
    //     console.log("REDIS_HOST:", configService.get("REDIS_HOST"));
    //     console.log("REDIS_USERNAME:", configService.get("REDIS_USERNAME"));
    //     console.log("REDIS_PASSWORD:", configService.get("REDIS_PASSWORD"));
    //     console.log("REDIS_PORT:", configService.get("REDIS_PORT"));
    //     const connection = {
    //       host: configService.get("REDIS_HOST"),
    //       port: configService.get("REDIS_PORT"),
    //       username: configService.get("REDIS_USERNAME"),
    //       password: configService.get("REDIS_PASSWORD"),
    //       tls: {},
    //     };
    //     console.log("Redis Connection Config:", connection); // In ra để kiểm tra
    //     return { connection };
    //   },
    //   inject: [ConfigService],
    // }),
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
    NotificationModule,
    ElasticsearchModule,
  ],
  controllers: [AppController, UsersController, PostsController],
  providers: [AppService],
})
export class AppModule {}
